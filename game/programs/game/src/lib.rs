use bolt_lang::prelude::*;

declare_id!("BYnLN1oSy9YrhUTm1n3RA8Vsf5CzJX2ZQCzpwrhSwUfp");

#[program]
pub mod game {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
