/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/vote_program.json`.
 */
export type VoteProgram = {
  "address": "EaFfpWf72ewSALLQdZSum6ThidXy81riWjcKa3aS8kyb",
  "metadata": {
    "name": "voteProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "downvote",
      "discriminator": [
        73,
        64,
        0,
        158,
        133,
        185,
        55,
        7
      ],
      "accounts": [
        {
          "name": "voteAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "url"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "url",
          "type": "string"
        }
      ]
    },
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
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "voteAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "url"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "url",
          "type": "string"
        }
      ]
    },
    {
      "name": "upvote",
      "discriminator": [
        197,
        8,
        144,
        51,
        126,
        41,
        156,
        81
      ],
      "accounts": [
        {
          "name": "voteAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "url"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "url",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "voteState",
      "discriminator": [
        100,
        177,
        100,
        106,
        158,
        188,
        195,
        137
      ]
    }
  ],
  "types": [
    {
      "name": "voteState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "score",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
