use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod neplus {
    use super::*;

    // Initialize a new project
    pub fn initialize_project(
        ctx: Context<InitializeProject>,
        title: String,
        description: String,
        token_supply: u64,
    ) -> Result<()> {
        let project = &mut ctx.accounts.project;
        let creator = &ctx.accounts.creator;

        project.creator = creator.key();
        project.title = title;
        project.description = description;
        project.token_supply = token_supply;
        project.status = ProjectStatus::Active;
        project.created_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    // Add a collaborator to a project
    pub fn add_collaborator(
        ctx: Context<AddCollaborator>,
        role: String,
        allocation: u64,
    ) -> Result<()> {
        let collaboration = &mut ctx.accounts.collaboration;
        let project = &ctx.accounts.project;
        let collaborator = &ctx.accounts.collaborator;

        collaboration.project = project.key();
        collaboration.collaborator = collaborator.key();
        collaboration.role = role;
        collaboration.token_allocation = allocation;
        collaboration.status = CollaborationStatus::Active;
        collaboration.joined_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    // Create a resource offering
    pub fn create_resource(
        ctx: Context<CreateResource>,
        title: String,
        description: String,
        resource_type: ResourceType,
        exchange_type: ExchangeType,
        price: u64,
    ) -> Result<()> {
        let resource = &mut ctx.accounts.resource;
        let provider = &ctx.accounts.provider;

        resource.provider = provider.key();
        resource.title = title;
        resource.description = description;
        resource.resource_type = resource_type;
        resource.exchange_type = exchange_type;
        resource.price = price;
        resource.status = ResourceStatus::Available;
        resource.created_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    // Exchange tokens for resources
    pub fn exchange_resource(
        ctx: Context<ExchangeResource>,
        amount: u64,
    ) -> Result<()> {
        let resource = &mut ctx.accounts.resource;
        let buyer = &ctx.accounts.buyer;
        let provider = &ctx.accounts.provider;

        // Transfer tokens from buyer to provider
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.buyer_token_account.to_account_info(),
                    to: ctx.accounts.provider_token_account.to_account_info(),
                    authority: buyer.to_account_info(),
                },
            ),
            amount,
        )?;

        // Update resource status
        resource.status = ResourceStatus::Exchanged;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeProject<'info> {
    #[account(init, payer = creator, space = 8 + 32 + 100 + 500 + 8 + 1 + 8)]
    pub project: Account<'info, Project>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddCollaborator<'info> {
    #[account(init, payer = collaborator, space = 8 + 32 + 32 + 100 + 8 + 1 + 8)]
    pub collaboration: Account<'info, Collaboration>,
    #[account(mut)]
    pub project: Account<'info, Project>,
    #[account(mut)]
    pub collaborator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateResource<'info> {
    #[account(init, payer = provider, space = 8 + 32 + 100 + 500 + 1 + 1 + 8 + 1 + 8)]
    pub resource: Account<'info, Resource>,
    #[account(mut)]
    pub provider: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExchangeResource<'info> {
    #[account(mut)]
    pub resource: Account<'info, Resource>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: Provider account
    pub provider: AccountInfo<'info>,
    #[account(mut)]
    pub buyer_token_account: Account<'info, token::TokenAccount>,
    #[account(mut)]
    pub provider_token_account: Account<'info, token::TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Project {
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub token_supply: u64,
    pub status: ProjectStatus,
    pub created_at: i64,
}

#[account]
pub struct Collaboration {
    pub project: Pubkey,
    pub collaborator: Pubkey,
    pub role: String,
    pub token_allocation: u64,
    pub status: CollaborationStatus,
    pub joined_at: i64,
}

#[account]
pub struct Resource {
    pub provider: Pubkey,
    pub title: String,
    pub description: String,
    pub resource_type: ResourceType,
    pub exchange_type: ExchangeType,
    pub price: u64,
    pub status: ResourceStatus,
    pub created_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum ProjectStatus {
    Active,
    Completed,
    Paused,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum CollaborationStatus {
    Active,
    Ended,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum ResourceType {
    Service,
    Skill,
    Material,
    Funding,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum ExchangeType {
    Token,
    Collaboration,
    FutureBenefit,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum ResourceStatus {
    Available,
    Reserved,
    Exchanged,
}