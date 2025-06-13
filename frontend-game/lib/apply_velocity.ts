/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/apply_velocity.json`.
 */
export type ApplyVelocity = {
  "address": "EXupjwBfvqGdhhHB5EC6Uu2md3Q9jupfJe3zZBT1n34u",
  "metadata": {
    "name": "applyVelocity",
    "version": "0.2.3",
    "spec": "0.1.0",
    "description": "Created with Bolt"
  },
  "instructions": [
    {
      "name": "boltExecute",
      "discriminator": [
        75,
        206,
        62,
        210,
        52,
        215,
        104,
        109
      ],
      "accounts": [
        {
          "name": "authority"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": "bytes"
        }
      ],
      "returns": {
        "vec": "bytes"
      }
    },
    {
      "name": "execute",
      "discriminator": [
        130,
        221,
        242,
        154,
        13,
        193,
        189,
        29
      ],
      "accounts": [
        {
          "name": "position"
        },
        {
          "name": "velocity"
        },
        {
          "name": "authority"
        }
      ],
      "args": [
        {
          "name": "argsP",
          "type": "bytes"
        }
      ],
      "returns": {
        "vec": "bytes"
      }
    }
  ],
  "accounts": [
    {
      "name": "position",
      "discriminator": [
        170,
        188,
        143,
        228,
        122,
        64,
        247,
        208
      ]
    },
    {
      "name": "velocity",
      "discriminator": [
        137,
        10,
        3,
        249,
        178,
        3,
        222,
        248
      ]
    }
  ],
  "types": [
    {
      "name": "boltMetadata",
      "docs": [
        "Metadata for the component."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "position",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "x",
            "type": "i64"
          },
          {
            "name": "y",
            "type": "i64"
          },
          {
            "name": "z",
            "type": "i64"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "boltMetadata",
            "type": {
              "defined": {
                "name": "boltMetadata"
              }
            }
          }
        ]
      }
    },
    {
      "name": "velocity",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vx",
            "type": "i64"
          },
          {
            "name": "vy",
            "type": "i64"
          },
          {
            "name": "boltMetadata",
            "type": {
              "defined": {
                "name": "boltMetadata"
              }
            }
          }
        ]
      }
    }
  ]
};
