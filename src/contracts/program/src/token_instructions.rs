use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};
use crate::token_standards::*;

#[derive(Accounts)]
pub struct InitializeToken<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 200)]
    pub token_info: Account<'info, TokenInfo>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintToken<'info> {
    #[account(mut)]
    pub token_info: Account<'info, TokenInfo>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    #[account(mut)]
    pub holder: Account<'info, TokenHolder>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct BurnToken<'info> {
    #[account(mut)]
    pub token_info: Account<'info, TokenInfo>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub holder: Account<'info, TokenHolder>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct TransferToken<'info> {
    pub token_info: Account<'info, TokenInfo>,
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    #[account(mut)]
    pub from_holder: Account<'info, TokenHolder>,
    #[account(mut)]
    pub to_holder: Account<'info, TokenHolder>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateVesting<'info> {
    pub token_info: Account<'info, TokenInfo>,
    #[account(mut)]
    pub holder: Account<'info, TokenHolder>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

// Token instruction handlers
pub fn handle_initialize_token(
    ctx: Context<InitializeToken>,
    metadata: TokenMetadata,
    config: TokenConfig,
    distribution_rules: DistributionRules,
    permissions: TokenPermissions,
) -> Result<()> {
    let token_info = &mut ctx.accounts.token_info;
    token_info.initialize(
        metadata,
        config,
        distribution_rules,
        permissions,
        ctx.accounts.authority.key(),
    )
}

pub fn handle_mint_token(
    ctx: Context<MintToken>,
    amount: u64,
) -> Result<()> {
    let token_info = &mut ctx.accounts.token_info;
    let holder = &mut ctx.accounts.holder;

    // Verify authority
    if ctx.accounts.authority.key() != token_info.authority {
        return Err(error!(TokenError::UnauthorizedOperation));
    }

    // Mint tokens
    token_info.mint(amount, holder)?;

    // Create mint CPI
    token::mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.to.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        amount,
    )?;

    Ok(())
}

pub fn handle_burn_token(
    ctx: Context<BurnToken>,
    amount: u64,
) -> Result<()> {
    let token_info = &mut ctx.accounts.token_info;
    let holder = &mut ctx.accounts.holder;

    // Verify authority
    if ctx.accounts.authority.key() != token_info.authority 
        && ctx.accounts.authority.key() != holder.owner {
        return Err(error!(TokenError::UnauthorizedOperation));
    }

    // Burn tokens
    token_info.burn(amount, holder)?;

    // Create burn CPI
    token::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.from.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        amount,
    )?;

    Ok(())
}

pub fn handle_transfer_token(
    ctx: Context<TransferToken>,
    amount: u64,
) -> Result<()> {
    let token_info = &ctx.accounts.token_info;
    let from_holder = &mut ctx.accounts.from_holder;
    let to_holder = &mut ctx.accounts.to_holder;

    // Verify authority
    if ctx.accounts.authority.key() != from_holder.owner {
        return Err(error!(TokenError::UnauthorizedOperation));
    }

    // Transfer tokens
    token_info.transfer(amount, from_holder, to_holder)?;

    // Create transfer CPI
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.from.to_account_info(),
                to: ctx.accounts.to.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        amount,
    )?;

    Ok(())
}

pub fn handle_update_vesting(
    ctx: Context<UpdateVesting>,
    schedule: VestingSchedule,
) -> Result<()> {
    let token_info = &ctx.accounts.token_info;
    let holder = &mut ctx.accounts.holder;

    // Verify authority
    if ctx.accounts.authority.key() != token_info.authority {
        return Err(error!(TokenError::UnauthorizedOperation));
    }

    token_info.update_vesting(holder, schedule)
}