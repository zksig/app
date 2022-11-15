import { AnchorProvider, Program, utils } from "@project-serum/anchor";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { IDL } from "../utils/e_signatures";
import { getContract } from "./filecoin";

export type SolanaProfile = {
  agreementCount: number;
  signaturesCount: number;
  address: PublicKey;
};

type AgreementStatus = "pending" | "complete" | "approved" | "rejected";

export type Agreement = {
  address: PublicKey;
  profile: PublicKey;
  identifier: string;
  cid: string;
  encryptedCid: string;
  descriptionCid: string;
  status: AgreementStatus;
  signedPackets: number;
  totalPackets: number;
};

export type AgreementWithSignatures = Agreement & {
  signatures: SignatureConstraint[];
};

export type SignatureConstraint = {
  address: PublicKey;
  agreement: PublicKey;
  index: number;
  identifier: string;
  signer: PublicKey | null;
  used: boolean;
};

export type SignaturePacket = {
  address: PublicKey;
  agreement: PublicKey;
  identifier: string;
  encryptedCid: string;
  index: number;
  signer: PublicKey;
  signed: boolean;
};

const programId = new PublicKey(
  process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID ||
    "EqsfiqKZqSVk6r8mMBSsad6hMaYxy1pLqkfG2w6St9Yf"
);

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com",
  "processed"
);

const getProvider = () => {
  return new AnchorProvider(
    connection,
    // @ts-ignore
    typeof window !== "undefined" ? window.solana : {},
    {}
  );
};

const getProgram = () => {
  return new Program(IDL, programId, getProvider());
};

export const createSolanaProfile = async () => {
  const provider = getProvider();
  const program = getProgram();

  const [address] = await PublicKey.findProgramAddress(
    [utils.bytes.utf8.encode("profile"), provider.publicKey.toBuffer()],
    program.programId
  );

  await program.methods
    .createProfile()
    .accounts({
      profile: address,
      owner: provider.wallet.publicKey,
    })
    .rpc();
};

export const getSolanaProfile = async (): Promise<SolanaProfile> => {
  const provider = getProvider();
  const program = getProgram();

  const [address] = await PublicKey.findProgramAddress(
    [utils.bytes.utf8.encode("profile"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  const profileRes = await program.account.profile.fetch(address);

  return {
    address,
    agreementCount: profileRes.agreementsCount,
    signaturesCount: profileRes.signaturesCount,
  };
};

export const getAllSolanaProfiles = () => {
  const program = getProgram();
  return program.account.profile.all();
};

export const getAgreementAddress = async (options?: {
  profile?: SolanaProfile;
  index?: number;
}) => {
  const program = getProgram();
  const profile = options?.profile || (await getSolanaProfile());
  const [address] = await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode("agreement"),
      utils.bytes.utf8.encode(
        (options?.index ?? profile.agreementCount).toString()
      ),
      profile.address.toBuffer(),
    ],
    program.programId
  );

  return address;
};

export const createAgreement = async ({
  identifier,
  cid,
  encryptedCid,
  descriptionCid,
  description,
}: {
  identifier: string;
  cid: string;
  encryptedCid: string;
  descriptionCid: string;
  description: { identifier: string; fields: string[] }[];
}) => {
  const provider = getProvider();
  const program = getProgram();

  const profile = await getSolanaProfile();

  const agreementAddress = await getAgreementAddress({
    profile,
    index: profile.agreementCount,
  });

  const tx = new Transaction();

  tx.add(
    await program.methods
      .createAgreement(
        identifier,
        cid,
        encryptedCid,
        descriptionCid,
        description.length
      )
      .accounts({
        agreement: agreementAddress,
        profile: profile.address,
        owner: provider.wallet.publicKey,
      })
      .transaction()
  );

  const constraintTransactions = await Promise.all(
    description.map(async ({ identifier }, i) => {
      const [constraint] = await PublicKey.findProgramAddress(
        [
          utils.bytes.utf8.encode("constraint"),
          utils.bytes.utf8.encode(i.toString()),
          agreementAddress.toBuffer(),
        ],
        program.programId
      );

      return program.methods
        .createSignatureConstraint(i, identifier, null)
        .accounts({
          constraint,
          agreement: agreementAddress,
          profile: profile.address,
          owner: provider.wallet.publicKey,
        })
        .transaction();
    })
  );

  tx.add(...constraintTransactions);

  await provider.sendAndConfirm(tx);

  return agreementAddress;
};

export const getAgreements = async (): Promise<Agreement[]> => {
  const program = getProgram();

  const profile = await getSolanaProfile();

  const addresses = await Promise.all(
    [...Array(profile.agreementCount)].map((_, i) => {
      return getAgreementAddress({ index: i });
    })
  );

  const agreements = (await program.account.agreement.fetchMultiple(
    addresses
  )) as Agreement[];

  return agreements.map((agreement, i) => ({
    ...agreement,
    status: Object.keys(agreement?.status || {})[0] as AgreementStatus,
    address: addresses[i],
  }));
};

export const getAllAgreements = () => {
  const program = getProgram();
  return program.account.agreement.all();
};

export const getAgreement = async (
  address: PublicKey
): Promise<Agreement & { signatures: SignatureConstraint[] }> => {
  const program = getProgram();

  const agreement = await program.account.agreement.fetch(address);

  const signatureAddresses = await Promise.all(
    [...Array(agreement.totalPackets)].map(async (_, i) => {
      const [signatureAddress] = await PublicKey.findProgramAddress(
        [
          utils.bytes.utf8.encode("constraint"),
          utils.bytes.utf8.encode(i.toString()),
          address.toBuffer(),
        ],
        program.programId
      );
      return signatureAddress;
    })
  );

  const signatures = (
    await program.account.signatureConstraint.fetchMultiple(signatureAddresses)
  ).map((signature, i) => ({
    ...signature,
    address: signatureAddresses[i],
  })) as SignatureConstraint[];

  return {
    ...agreement,
    signatures,
    address: new PublicKey(address),
    status: Object.keys(agreement.status)[0] as AgreementStatus,
  };
};

export const signAgreement = async ({
  agreementAddress,
  encryptedCid,
  index,
}: {
  agreementAddress: PublicKey;
  encryptedCid: string;
  index: number;
}) => {
  const provider = getProvider();
  const program = getProgram();

  const profile = await getSolanaProfile();

  const [[packet], [constraint]] = await Promise.all([
    PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("packet"),
        utils.bytes.utf8.encode(profile.signaturesCount.toString()),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    ),
    PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("constraint"),
        utils.bytes.utf8.encode(index.toString()),
        agreementAddress.toBuffer(),
      ],
      program.programId
    ),
  ]);

  await program.methods
    .signSignaturePacket(index, encryptedCid)
    .accounts({
      packet,
      constraint,
      profile: profile.address,
      agreement: agreementAddress,
      signer: provider.wallet.publicKey,
    })
    .rpc();
};

export const getSignatures = async () => {
  const provider = getProvider();
  const program = getProgram();

  const profile = await getSolanaProfile();

  const addresses = await Promise.all(
    [...Array(profile.signaturesCount)].map(async (_, i) => {
      const [address] = await PublicKey.findProgramAddress(
        [
          utils.bytes.utf8.encode("packet"),
          utils.bytes.utf8.encode(i.toString()),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );
      return address;
    })
  );

  const signatures = (await program.account.eSignaturePacket.fetchMultiple(
    addresses
  )) as SignaturePacket[];

  return signatures.map((signature, i) => ({
    ...signature,
    address: addresses[i],
  }));
};

export const getSignature = async (
  address: PublicKey
): Promise<SignaturePacket> => {
  const program = getProgram();

  const signature = await program.account.eSignaturePacket.fetch(address);

  return {
    address,
    agreement: signature.agreement,
    identifier: signature.identifier,
    encryptedCid: signature.encryptedCid,
    index: signature.index,
    signer: signature.signer!,
    signed: signature.signed,
  };
};

export const getAllSignatures = () => {
  const program = getProgram();
  return program.account.signatureConstraint.all();
};
