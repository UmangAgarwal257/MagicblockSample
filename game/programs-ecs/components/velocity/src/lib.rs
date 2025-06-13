#![allow(unexpected_cfgs)]
use bolt_lang::*;

declare_id!("B6Wu6247Q4pF1436VDoqmBsDmkrW2Pcp81rCAdX7K13b");

#[component]
#[derive(Default)]
pub struct Velocity {
    pub vx: i64,
    pub vy: i64,
}
