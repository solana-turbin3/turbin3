use anchor_lang::prelude::*;

declare_id!("8E7XGUrfnsYEse2YkBiMFvQ9VL2vi5EV4o3RPRgAcHFv");

#[program]
pub mod vault_anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
