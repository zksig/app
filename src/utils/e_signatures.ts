export type ESignature = {
    "version": "0.1.0",
    "name": "e_signature",
    "instructions": [
      {
        "name": "createAgreement",
        "accounts": [
          {
            "name": "agreement",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "originator",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "identifier",
            "type": "string"
          },
          {
            "name": "cid",
            "type": "string"
          },
          {
            "name": "descriptionCid",
            "type": "string"
          },
          {
            "name": "totalPackets",
            "type": "u8"
          }
        ],
        "returns": "publicKey"
      },
      {
        "name": "approveAgreement",
        "accounts": [
          {
            "name": "agreement",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "originator",
            "isMut": true,
            "isSigner": true
          }
        ],
        "args": []
      },
      {
        "name": "rejectAgreement",
        "accounts": [
          {
            "name": "agreement",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "originator",
            "isMut": true,
            "isSigner": true
          }
        ],
        "args": []
      },
      {
        "name": "createSignaturePacket",
        "accounts": [
          {
            "name": "packet",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "agreement",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "originator",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "identifier",
            "type": "string"
          },
          {
            "name": "signer",
            "type": {
              "option": "publicKey"
            }
          }
        ],
        "returns": "publicKey"
      },
      {
        "name": "signSignaturePacket",
        "accounts": [
          {
            "name": "packet",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "agreement",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "identifier",
            "type": "string"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "agreement",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "originator",
              "type": "publicKey"
            },
            {
              "name": "cid",
              "type": "string"
            },
            {
              "name": "descriptionCid",
              "type": "string"
            },
            {
              "name": "status",
              "type": {
                "defined": "AgreementStatus"
              }
            },
            {
              "name": "signedPackets",
              "type": "u8"
            },
            {
              "name": "totalPackets",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "eSignaturePacket",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "agreement",
              "type": "publicKey"
            },
            {
              "name": "identifier",
              "type": "string"
            },
            {
              "name": "signer",
              "type": {
                "option": "publicKey"
              }
            },
            {
              "name": "signed",
              "type": "bool"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "AgreementStatus",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "PENDING"
            },
            {
              "name": "COMPLETE"
            },
            {
              "name": "APPROVED"
            },
            {
              "name": "REJECTED"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "UnexpectedError"
      },
      {
        "code": 6001,
        "name": "NonPendingAgreement"
      },
      {
        "code": 6002,
        "name": "MismatchedSigner"
      }
    ]
  };
  
  export const IDL: ESignature = {
    "version": "0.1.0",
    "name": "e_signature",
    "instructions": [
      {
        "name": "createAgreement",
        "accounts": [
          {
            "name": "agreement",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "originator",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "identifier",
            "type": "string"
          },
          {
            "name": "cid",
            "type": "string"
          },
          {
            "name": "descriptionCid",
            "type": "string"
          },
          {
            "name": "totalPackets",
            "type": "u8"
          }
        ],
        "returns": "publicKey"
      },
      {
        "name": "approveAgreement",
        "accounts": [
          {
            "name": "agreement",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "originator",
            "isMut": true,
            "isSigner": true
          }
        ],
        "args": []
      },
      {
        "name": "rejectAgreement",
        "accounts": [
          {
            "name": "agreement",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "originator",
            "isMut": true,
            "isSigner": true
          }
        ],
        "args": []
      },
      {
        "name": "createSignaturePacket",
        "accounts": [
          {
            "name": "packet",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "agreement",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "originator",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "identifier",
            "type": "string"
          },
          {
            "name": "signer",
            "type": {
              "option": "publicKey"
            }
          }
        ],
        "returns": "publicKey"
      },
      {
        "name": "signSignaturePacket",
        "accounts": [
          {
            "name": "packet",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "agreement",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "identifier",
            "type": "string"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "agreement",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "originator",
              "type": "publicKey"
            },
            {
              "name": "cid",
              "type": "string"
            },
            {
              "name": "descriptionCid",
              "type": "string"
            },
            {
              "name": "status",
              "type": {
                "defined": "AgreementStatus"
              }
            },
            {
              "name": "signedPackets",
              "type": "u8"
            },
            {
              "name": "totalPackets",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "eSignaturePacket",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "agreement",
              "type": "publicKey"
            },
            {
              "name": "identifier",
              "type": "string"
            },
            {
              "name": "signer",
              "type": {
                "option": "publicKey"
              }
            },
            {
              "name": "signed",
              "type": "bool"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "AgreementStatus",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "PENDING"
            },
            {
              "name": "COMPLETE"
            },
            {
              "name": "APPROVED"
            },
            {
              "name": "REJECTED"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "UnexpectedError"
      },
      {
        "code": 6001,
        "name": "NonPendingAgreement"
      },
      {
        "code": 6002,
        "name": "MismatchedSigner"
      }
    ]
  };
  