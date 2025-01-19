use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};

// Token types supported by the platform
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum TokenType {
    // Standard fungible project token
    ProjectToken,
    // Governance token with voting rights
    GovernanceToken,
    // Token representing resource ownership
    ResourceToken,
    // Token representing collaboration rights
    CollaborationToken,
    // Non-fungible token for unique assets
    NFT,
}

// Token metadata structure
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TokenMetadata {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub decimals: u8,
    pub token_type: TokenType,
    pub creator: Pubkey,
    pub is_frozen: bool,
    pub created_at: i64,
}

// Token configuration for minting
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TokenConfig {
    pub initial_supply: u64,
    pub max_supply: Option<u64>,
    pub is_mintable: bool,
    pub is_burnable: bool,
    pub is_transferable: bool,
    pub requires_auth: bool,
}

// Token distribution rules
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct DistributionRules {
    pub vesting_period: Option<i64>,
    pub cliff_period: Option<i64>,
    pub transfer_lock: Option<i64>,
    pub min_hold_period: Option<i64>,
}

// Token permissions
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TokenPermissions {
    pub can_mint: bool,
    pub can_burn: bool,
    pub can_freeze: bool,
    pub can_modify_metadata: bool,
}

// Token account
#[account]
pub struct TokenInfo {
    pub mint: Pubkey,
    pub metadata: TokenMetadata,
    pub config: TokenConfig,
    pub distribution_rules: DistributionRules,
    pub permissions: TokenPermissions,
    pub total_supply: u64,
    pub holder_count: u64,
    pub authority: Pubkey,
}

// Token holder account
#[account]
pub struct TokenHolder {
    pub owner: Pubkey,
    pub balance: u64,
    pub locked_balance: u64,
    pub vesting_schedule: Option<VestingSchedule>,
    pub last_transfer: i64,
}

// Vesting schedule
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VestingSchedule {
    pub total_amount: u64,
    pub released_amount: u64,
    pub start_time: i64,
    pub end_time: i64,
    pub cliff_time: i64,
    pub interval: i64,
}

// Token errors
#[error_code]
pub enum TokenError {
    #[msg("Invalid token type")]
    InvalidTokenType,
    #[msg("Token supply exceeded")]
    SupplyExceeded,
    #[msg("Token transfer locked")]
    TransferLocked,
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Invalid vesting schedule")]
    InvalidVestingSchedule,
    #[msg("Unauthorized token operation")]
    UnauthorizedOperation,
}

// Token interface methods
impl TokenInfo {
    // Initialize new token
    pub fn initialize(
        &mut self,
        metadata: TokenMetadata,
        config: TokenConfig,
        distribution_rules: DistributionRules,
        permissions: TokenPermissions,
        authority: Pubkey,
    ) -> Result<()> {
        self.metadata = metadata;
        self.config = config;
        self.distribution_rules = distribution_rules;
        self.permissions = permissions;
        self.authority = authority;
        self.total_supply = 0;
        self.holder_count = 0;
        Ok(())
    }

    // Mint new tokens
    pub fn mint(
        &mut self,
        amount: u64,
        to: &mut TokenHolder,
    ) -> Result<()> {
        if !self.config.is_mintable {
            return Err(error!(TokenError::UnauthorizedOperation));
        }

        if let Some(max_supply) = self.config.max_supply {
            if self.total_supply + amount > max_supply {
                return Err(error!(TokenError::SupplyExceeded));
            }
        }

        self.total_supply = self.total_supply.checked_add(amount)
            .ok_or(TokenError::SupplyExceeded)?;
        
        to.balance = to.balance.checked_add(amount)
            .ok_or(TokenError::SupplyExceeded)?;

        Ok(())
    }

    // Burn tokens
    pub fn burn(
        &mut self,
        amount: u64,
        from: &mut TokenHolder,
    ) -> Result<()> {
        if !self.config.is_burnable {
            return Err(error!(TokenError::UnauthorizedOperation));
        }

        if from.balance < amount {
            return Err(error!(TokenError::InsufficientBalance));
        }

        self.total_supply = self.total_supply.checked_sub(amount)
            .ok_or(TokenError::InsufficientBalance)?;
        
        from.balance = from.balance.checked_sub(amount)
            .ok_or(TokenError::InsufficientBalance)?;

        Ok(())
    }

    // Transfer tokens
    pub fn transfer(
        &self,
        amount: u64,
        from: &mut TokenHolder,
        to: &mut TokenHolder,
    ) -> Result<()> {
        if !self.config.is_transferable {
            return Err(error!(TokenError::UnauthorizedOperation));
        }

        // Check transfer lock
        if let Some(lock_period) = self.distribution_rules.transfer_lock {
            let current_time = Clock::get()?.unix_timestamp;
            if current_time < lock_period {
                return Err(error!(TokenError::TransferLocked));
            }
        }

        // Check minimum hold period
        if let Some(min_hold) = self.distribution_rules.min_hold_period {
            let current_time = Clock::get()?.unix_timestamp;
            if current_time - from.last_transfer < min_hold {
                return Err(error!(TokenError::TransferLocked));
            }
        }

        if from.balance < amount {
            return Err(error!(TokenError::InsufficientBalance));
        }

        from.balance = from.balance.checked_sub(amount)
            .ok_or(TokenError::InsufficientBalance)?;
        
        to.balance = to.balance.checked_add(amount)
            .ok_or(TokenError::SupplyExceeded)?;

        from.last_transfer = Clock::get()?.unix_timestamp;

        Ok(())
    }

    // Update vesting schedule
    pub fn update_vesting(
        &self,
        holder: &mut TokenHolder,
        schedule: VestingSchedule,
    ) -> Result<()> {
        if schedule.end_time <= schedule.start_time {
            return Err(error!(TokenError::InvalidVestingSchedule));
        }

        holder.vesting_schedule = Some(schedule);
        Ok(())
    }

    // Release vested tokens
    pub fn release_vested(
        &self,
        holder: &mut TokenHolder,
    ) -> Result<()> {
        if let Some(schedule) = &mut holder.vesting_schedule {
            let current_time = Clock::get()?.unix_timestamp;
            
            // Check cliff period
            if current_time < schedule.cliff_time {
                return Ok(());
            }

            // Calculate vested amount
            let vesting_duration = schedule.end_time - schedule.start_time;
            let elapsed = current_time - schedule.start_time;
            let vested_amount = (schedule.total_amount as f64 * elapsed as f64 
                / vesting_duration as f64) as u64;
            
            let releasable = vested_amount.checked_sub(schedule.released_amount)
                .ok_or(TokenError::InvalidVestingSchedule)?;
            
            if releasable > 0 {
                holder.locked_balance = holder.locked_balance
                    .checked_sub(releasable)
                    .ok_or(TokenError::InsufficientBalance)?;
                
                holder.balance = holder.balance
                    .checked_add(releasable)
                    .ok_or(TokenError::SupplyExceeded)?;
                
                schedule.released_amount = schedule.released_amount
                    .checked_add(releasable)
                    .ok_or(TokenError::SupplyExceeded)?;
            }
        }
        Ok(())
    }
}