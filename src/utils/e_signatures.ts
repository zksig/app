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
      name: "createSignaturePacket";
      accounts: [
        {
          name: "packet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "signerProfile";
          isMut: false;
          isSigner: false;
        },
        {
          name: "ownerProfile";
          isMut: true;
          isSigner: false;
        },
        {
          name: "agreement";
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
          name: "signer";
          type: "publicKey";
        }
      ];
    },
    {
      name: "setupAndSignSignaturePacket";
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
          name: "identifier";
          type: "string";
        }
      ];
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
          name: "agreement";
          isMut: true;
          isSigner: false;
        },
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "identifier";
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
            name: "identifier";
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
      name: "createSignaturePacket",
      accounts: [
        {
          name: "packet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "signerProfile",
          isMut: false,
          isSigner: false,
        },
        {
          name: "ownerProfile",
          isMut: true,
          isSigner: false,
        },
        {
          name: "agreement",
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
          name: "signer",
          type: "publicKey",
        },
      ],
    },
    {
      name: "setupAndSignSignaturePacket",
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
          name: "identifier",
          type: "string",
        },
      ],
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
          name: "agreement",
          isMut: true,
          isSigner: false,
        },
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "identifier",
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
            name: "identifier",
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
  ],
};
