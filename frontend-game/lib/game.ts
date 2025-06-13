/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/game.json`.
 */
export type Game = {
  "address": "BYnLN1oSy9YrhUTm1n3RA8Vsf5CzJX2ZQCzpwrhSwUfp",
  "metadata": {
    "name": "game",
    "version": "0.2.3",
    "spec": "0.1.0",
    "description": "Created with Bolt"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [],
      "args": []
    }
  ]
};
