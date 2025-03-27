use solana_idlgen::idlgen;

idlgen!({
  "version": "0.1.0",
  "name": "turbin3_prereq",
  "instructions": [
    {
      "name": "complete",
      "discriminator": [
        0,
        77,
        224,
        147,
        136,
        25,
        88,
        76
      ],
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "prereq",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  114,
                  101,
                  113
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "isMut": false,
          "isSigner": false,
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "github_username",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "update",
      "discriminator": [
        219,
        200,
        88,
        176,
        158,
        63,
        253,
        127
      ],
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "prereq",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "system_program",
          "isMut": false,
          "isSigner": false,
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "github",
          "type": "bytes"
        }
      ]
    }
  ],
  "metadata": {
    "address": "ADcaide4vBtKuyZQqdU689YqEGZMCmS4tL35bdTv9wJa"
  }
});