export const IDL = {
  version: "0.1.0",
  name: "neplus",
  instructions: [
    {
      name: "initializeProject",
      accounts: [
        {
          name: "project",
          isMut: true,
          isSigner: false
        },
        {
          name: "creator",
          isMut: true,
          isSigner: true
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "title",
          type: "string"
        },
        {
          name: "description",
          type: "string"
        },
        {
          name: "tokenSupply",
          type: "u64"
        }
      ]
    },
    {
      name: "addCollaborator",
      accounts: [
        {
          name: "collaboration",
          isMut: true,
          isSigner: false
        },
        {
          name: "project",
          isMut: true,
          isSigner: false
        },
        {
          name: "collaborator",
          isMut: true,
          isSigner: true
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "role",
          type: "string"
        },
        {
          name: "allocation",
          type: "u64"
        }
      ]
    },
    {
      name: "createResource",
      accounts: [
        {
          name: "resource",
          isMut: true,
          isSigner: false
        },
        {
          name: "provider",
          isMut: true,
          isSigner: true
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "title",
          type: "string"
        },
        {
          name: "description",
          type: "string"
        },
        {
          name: "resourceType",
          type: {
            defined: "ResourceType"
          }
        },
        {
          name: "exchangeType",
          type: {
            defined: "ExchangeType"
          }
        },
        {
          name: "price",
          type: "u64"
        }
      ]
    },
    {
      name: "exchangeResource",
      accounts: [
        {
          name: "resource",
          isMut: true,
          isSigner: false
        },
        {
          name: "buyer",
          isMut: true,
          isSigner: true
        },
        {
          name: "provider",
          isMut: false,
          isSigner: false
        },
        {
          name: "buyerTokenAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "providerTokenAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    }
  ],
  accounts: [
    {
      name: "Project",
      type: {
        kind: "struct",
        fields: [
          {
            name: "creator",
            type: "publicKey"
          },
          {
            name: "title",
            type: "string"
          },
          {
            name: "description",
            type: "string"
          },
          {
            name: "tokenSupply",
            type: "u64"
          },
          {
            name: "status",
            type: {
              defined: "ProjectStatus"
            }
          },
          {
            name: "createdAt",
            type: "i64"
          }
        ]
      }
    },
    {
      name: "Collaboration",
      type: {
        kind: "struct",
        fields: [
          {
            name: "project",
            type: "publicKey"
          },
          {
            name: "collaborator",
            type: "publicKey"
          },
          {
            name: "role",
            type: "string"
          },
          {
            name: "tokenAllocation",
            type: "u64"
          },
          {
            name: "status",
            type: {
              defined: "CollaborationStatus"
            }
          },
          {
            name: "joinedAt",
            type: "i64"
          }
        ]
      }
    },
    {
      name: "Resource",
      type: {
        kind: "struct",
        fields: [
          {
            name: "provider",
            type: "publicKey"
          },
          {
            name: "title",
            type: "string"
          },
          {
            name: "description",
            type: "string"
          },
          {
            name: "resourceType",
            type: {
              defined: "ResourceType"
            }
          },
          {
            name: "exchangeType",
            type: {
              defined: "ExchangeType"
            }
          },
          {
            name: "price",
            type: "u64"
          },
          {
            name: "status",
            type: {
              defined: "ResourceStatus"
            }
          },
          {
            name: "createdAt",
            type: "i64"
          }
        ]
      }
    }
  ],
  types: [
    {
      name: "ProjectStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Active"
          },
          {
            name: "Completed"
          },
          {
            name: "Paused"
          }
        ]
      }
    },
    {
      name: "CollaborationStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Active"
          },
          {
            name: "Ended"
          }
        ]
      }
    },
    {
      name: "ResourceType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Service"
          },
          {
            name: "Skill"
          },
          {
            name: "Material"
          },
          {
            name: "Funding"
          }
        ]
      }
    },
    {
      name: "ExchangeType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Token"
          },
          {
            name: "Collaboration"
          },
          {
            name: "FutureBenefit"
          }
        ]
      }
    },
    {
      name: "ResourceStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Available"
          },
          {
            name: "Reserved"
          },
          {
            name: "Exchanged"
          }
        ]
      }
    }
  ]
};