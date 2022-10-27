export type ESignature = {
  version: "0.1.0";
  name: "e_signature";
  instructions: [
    {
      name: "createProfile";
      accounts: [
        {
          name: "profile";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "createAgreement";
      accounts: [
        {
          name: "agreement";
          isMut: true;
          isSigner: false;
        },
        {
          name: "profile";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "identifier";
          type: "string";
        },
        {
          name: "cid";
          type: "string";
        },
        {
          name: "encryptedCid";
          type: "string";
        },
        {
          name: "descriptionCid";
          type: "string";
        },
        {
          name: "totalPackets";
          type: "u8";
        }
      ];
    },
    {
      name: "createSignatureConstraint";
      accounts: [
        {
          name: "constraint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "agreement";
          isMut: false;
          isSigner: false;
        },
        {
          name: "profile";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "index";
          type: "u8";
        },
        {
          name: "identifier";
          type: "string";
        },
        {
          name: "signer";
          type: {
            option: "publicKey";
          };
        }
      ];
    },
    {
      name: "approveAgreement";
      accounts: [
        {
          name: "agreement";
          isMut: true;
          isSigner: false;
        },
        {
          name: "profile";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "rejectAgreement";
      accounts: [
        {
          name: "agreement";
          isMut: true;
          isSigner: false;
        },
        {
          name: "profile";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "signSignaturePacket";
      accounts: [
        {
          name: "packet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "profile";
          isMut: true;
          isSigner: false;
        },
        {
          name: "constraint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "agreement";
          isMut: true;
          isSigner: false;
        },
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "index";
          type: "u8";
        },
        {
          name: "encryptedCid";
          type: "string";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "agreement";
      type: {
        kind: "struct";
        fields: [
          {
            name: "profile";
            type: "publicKey";
          },
          {
            name: "identifier";
            type: "string";
          },
          {
            name: "cid";
            type: "string";
          },
          {
            name: "encryptedCid";
            type: "string";
          },
          {
            name: "descriptionCid";
            type: "string";
          },
          {
            name: "status";
            type: {
              defined: "AgreementStatus";
            };
          },
          {
            name: "signedPackets";
            type: "u8";
          },
          {
            name: "totalPackets";
            type: "u8";
          },
          {
            name: "reserved";
            type: {
              array: ["u8", 128];
            };
          }
        ];
      };
    },
    {
      name: "eSignaturePacket";
      type: {
        kind: "struct";
        fields: [
          {
            name: "agreement";
            type: "publicKey";
          },
          {
            name: "index";
            type: "u8";
          },
          {
            name: "encryptedCid";
            type: "string";
          },
          {
            name: "signer";
            type: "publicKey";
          },
          {
            name: "signed";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "reserved";
            type: {
              array: ["u8", 128];
            };
          }
        ];
      };
    },
    {
      name: "profile";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "agreementsCount";
            type: "u32";
          },
          {
            name: "signaturesCount";
            type: "u32";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "reserved";
            type: {
              array: ["u8", 64];
            };
          }
        ];
      };
    },
    {
      name: "signatureConstraint";
      type: {
        kind: "struct";
        fields: [
          {
            name: "agreement";
            type: "publicKey";
          },
          {
            name: "index";
            type: "u8";
          },
          {
            name: "identifier";
            type: "string";
          },
          {
            name: "signer";
            type: {
              option: "publicKey";
            };
          },
          {
            name: "used";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "reserved";
            type: {
              array: ["u8", 64];
            };
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "AgreementStatus";
      type: {
        kind: "enum";
        variants: [
          {
            name: "PENDING";
          },
          {
            name: "COMPLETE";
          },
          {
            name: "APPROVED";
          },
          {
            name: "REJECTED";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "UnexpectedError";
    },
    {
      code: 6001;
      name: "NonPendingAgreement";
    },
    {
      code: 6002;
      name: "MismatchedSigner";
    },
    {
      code: 6003;
      name: "UsedConstraint";
    }
  ];
};

export const IDL: ESignature = {
  version: "0.1.0",
  name: "e_signature",
  instructions: [
    {
      name: "createProfile",
      accounts: [
        {
          name: "profile",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "createAgreement",
      accounts: [
        {
          name: "agreement",
          isMut: true,
          isSigner: false,
        },
        {
          name: "profile",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "identifier",
          type: "string",
        },
        {
          name: "cid",
          type: "string",
        },
        {
          name: "encryptedCid",
          type: "string",
        },
        {
          name: "descriptionCid",
          type: "string",
        },
        {
          name: "totalPackets",
          type: "u8",
        },
      ],
    },
    {
      name: "createSignatureConstraint",
      accounts: [
        {
          name: "constraint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "agreement",
          isMut: false,
          isSigner: false,
        },
        {
          name: "profile",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "index",
          type: "u8",
        },
        {
          name: "identifier",
          type: "string",
        },
        {
          name: "signer",
          type: {
            option: "publicKey",
          },
        },
      ],
    },
    {
      name: "approveAgreement",
      accounts: [
        {
          name: "agreement",
          isMut: true,
          isSigner: false,
        },
        {
          name: "profile",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "rejectAgreement",
      accounts: [
        {
          name: "agreement",
          isMut: true,
          isSigner: false,
        },
        {
          name: "profile",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "signSignaturePacket",
      accounts: [
        {
          name: "packet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "profile",
          isMut: true,
          isSigner: false,
        },
        {
          name: "constraint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "agreement",
          isMut: true,
          isSigner: false,
        },
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "index",
          type: "u8",
        },
        {
          name: "encryptedCid",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "agreement",
      type: {
        kind: "struct",
        fields: [
          {
            name: "profile",
            type: "publicKey",
          },
          {
            name: "identifier",
            type: "string",
          },
          {
            name: "cid",
            type: "string",
          },
          {
            name: "encryptedCid",
            type: "string",
          },
          {
            name: "descriptionCid",
            type: "string",
          },
          {
            name: "status",
            type: {
              defined: "AgreementStatus",
            },
          },
          {
            name: "signedPackets",
            type: "u8",
          },
          {
            name: "totalPackets",
            type: "u8",
          },
          {
            name: "reserved",
            type: {
              array: ["u8", 128],
            },
          },
        ],
      },
    },
    {
      name: "eSignaturePacket",
      type: {
        kind: "struct",
        fields: [
          {
            name: "agreement",
            type: "publicKey",
          },
          {
            name: "index",
            type: "u8",
          },
          {
            name: "encryptedCid",
            type: "string",
          },
          {
            name: "signer",
            type: "publicKey",
          },
          {
            name: "signed",
            type: "bool",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "reserved",
            type: {
              array: ["u8", 128],
            },
          },
        ],
      },
    },
    {
      name: "profile",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "agreementsCount",
            type: "u32",
          },
          {
            name: "signaturesCount",
            type: "u32",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "reserved",
            type: {
              array: ["u8", 64],
            },
          },
        ],
      },
    },
    {
      name: "signatureConstraint",
      type: {
        kind: "struct",
        fields: [
          {
            name: "agreement",
            type: "publicKey",
          },
          {
            name: "index",
            type: "u8",
          },
          {
            name: "identifier",
            type: "string",
          },
          {
            name: "signer",
            type: {
              option: "publicKey",
            },
          },
          {
            name: "used",
            type: "bool",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "reserved",
            type: {
              array: ["u8", 64],
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "AgreementStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "PENDING",
          },
          {
            name: "COMPLETE",
          },
          {
            name: "APPROVED",
          },
          {
            name: "REJECTED",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "UnexpectedError",
    },
    {
      code: 6001,
      name: "NonPendingAgreement",
    },
    {
      code: 6002,
      name: "MismatchedSigner",
    },
    {
      code: 6003,
      name: "UsedConstraint",
    },
  ],
};
