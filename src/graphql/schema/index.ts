export const typeDefs = `
  scalar File

  enum Network {
    ETHEREUM
    SOLANA
  }

  type Agreement {
    id: ID!
    requesterId: ID!
    cid: String!
    allowedNetworks: [Network]!
    updatedAt: String!
    createdAt: String!

    link: String!
    requester: UserProfile!
    signatures: [Signature]!
  }

  type Signature {
    id: ID!
    transactionHash: String!
    network: Network
    signerAddress: String
    agreementId: ID!
    updatedAt: String!
    createdAt: String!

    agreement: Agreement!
  }

  type UserProfile {
    id: ID!
    email: String!
    eth_address: String
    sol_address: String
    updatedAt: String!
    createdAt: String!

    agreements: [Agreement]!
    signatures: [Signature]!
  }

  type Query {
    agreements(page: Int): [Agreement]!
    agreement(id: ID!): Agreement

    signatures: [Signature]!
    signature(id: ID!): Signature

    me: UserProfile
  }

  input UpdateProfileInput {
    email: String!
    eth_address: String
    sol_address: String
  }

  input CreateAgreementInput {
    requesterId: ID!
    allowedNetworks: [Network]
  }

  input AddSignatureInput {
    agreementId: ID!
    network: Network
    signerAddress: String
  }

  input SignAgreementInput {
    id: ID!
    transactionHash: String!
    network: Network!
    signerAddress: String!
  }

  type Mutation {
    updateProfile(input: UpdateProfileInput!): UserProfile!

    createAgreement(input: CreateAgreementInput, agreement: File!): Agreement!

    addSignature(input: AddSignatureInput!): Signature!
    signAgreement(input: SignAgreementInput!): Signature!
  }
`;
