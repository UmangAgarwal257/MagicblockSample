#![allow(unexpected_cfgs)]
use bolt_lang::*;
use position::Position;
use velocity::Velocity;

declare_id!("EXupjwBfvqGdhhHB5EC6Uu2md3Q9jupfJe3zZBT1n34u");

#[system]
pub mod apply_velocity {

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
        let position = &mut ctx.accounts.position;
        let velocity = &ctx.accounts.velocity;

        position.x += velocity.vx;
        position.y += velocity.vy;

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub position: Position,
        pub velocity: Velocity,
    }
}
