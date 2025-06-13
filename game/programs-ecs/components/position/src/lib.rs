#![allow(unexpected_cfgs)]
use bolt_lang::*;

declare_id!("5iGfyRhCgzhMyncDvAA8qbEgkUJoumtTWov5vLVJ6mpa");

#[component]
#[derive(Default)]
pub struct Position {
    pub x: i64,
    pub y: i64,
    pub z: i64,
    #[max_len(20)]
    pub description: String,
}
