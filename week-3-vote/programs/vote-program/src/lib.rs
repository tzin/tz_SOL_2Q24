use anchor_lang::prelude::*;

declare_id!("EaFfpWf72ewSALLQdZSum6ThidXy81riWjcKa3aS8kyb");

#[program]
pub mod vote_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _url: String) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps)?;
        Ok(())
    }

    pub fn upvote(ctx: Context<Vote>, _url: String) -> Result<()> {
        ctx.accounts.upvote()?;
        ctx.accounts.vote_account.last_address = Some(ctx.accounts.signer.key());
        Ok(())
    }

    pub fn downvote(ctx: Context<Vote>, _url: String) -> Result<()> {
        ctx.accounts.downvote()?;
        ctx.accounts.vote_account.last_address = Some(ctx.accounts.signer.key());
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(_url: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        seeds = [_url.as_bytes().as_ref()],
        bump,
        space = VoteState::INIT_SPACE
    )]
    pub vote_account: Account<'info, VoteState>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, bumps: &InitializeBumps ) -> Result<()> {
        self.vote_account.score = 0;
        self.vote_account.bump = bumps.vote_account;
        self.vote_account.last_address = None;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(_url: String)]
pub struct Vote<'info> {
    #[account(
        mut,
        seeds = [_url.as_bytes().as_ref()],
        bump = vote_account.bump,
//        address = vote_account.last_address,
    )]
    pub vote_account: Account<'info, VoteState>,
}

impl<'info> Vote<'info> {
    pub fn upvote(&mut self) -> Result<()> {
        self.vote_account.score += 1;
  //      self.vote_account.last_address = Some(accounts.Signer.key());
        Ok(())
    }

    pub fn downvote(&mut self) -> Result<()> {
        self.vote_account.score -= 1;
 //       self.vote_account.last_address = Some(accounts.Signer.key());
        Ok(())
    }
   
}

#[account]
pub struct VoteState {
    pub score: i64,
    pub bump: u8,
    pub last_address: Option<Pubkey>,
}

impl Space for VoteState {
    const INIT_SPACE: usize = 8 + 8 + 1 + 33;
}