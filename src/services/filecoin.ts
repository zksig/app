import { constants, Contract, providers } from "ethers";
import ESignature from "../utils/ESignature.json";

export type SignatureConstraint = {
  identifier: string;
  signer: string;
  used: boolean;
};

export type Agreement = {
  owner: string;
  status: number;
  index: number;
  identifier: string;
  cid: string;
  encryptedCid: string;
  descriptionCid: string;
  signedPackets: number;
  totalPackets: number;
  constraints: SignatureConstraint[];
};

export type ESignaturePacket = {
  agreementOwner: string;
  agreementIndex: number;
  index: number;
  identifier: string;
  encryptedCid: string;
  signer: string;
};

const provider = new providers.Web3Provider(
  typeof window !== "undefined"
    ? window.ethereum
    : new providers.JsonRpcProvider()
);

const contract = new Contract(
  process.env.NEXT_PUBLIC_FILECOIN_CONTRACT ||
    "0x92Af8EFb9A433b232398fB6D801d080aE44AaB21",
  ESignature.abi,
  provider
);

export const getProvider = () => {
  return provider;
};

export const connect = async () => {
  const provider = await getProvider();
  const [account] = await provider.send("eth_requestAccounts", []);

  contract.connect(provider.getSigner());

  return account;
};

export const getAddress = async () => {
  return (await getProvider().send("eth_accounts", []))[0];
};

export const getIsConnected = async () => {
  return (await getProvider().send("eth_accounts", [])).length > 0;
};

export const getContract = () => {
  return contract.connect(provider.getSigner());
};

export const signMessage = async (message: string) => {
  return Uint8Array.from(
    Buffer.from(await getProvider().getSigner().signMessage(message))
  );
};

export const getProfile = async () => {
  return getContract().getProfile();
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
  const constraints = description.map(({ identifier }) => ({
    identifier,
    used: false,
    signer: constants.AddressZero,
  }));

  return (
    await getContract().createAgreement(
      identifier,
      cid,
      encryptedCid,
      descriptionCid,
      constraints
    )
  ).wait(1);
};

export const getAgreements = async (page = 1): Promise<Agreement[]> => {
  return getContract().getAgreements(await getAddress(), (page - 1) * 10);
};

export const getAgreement = async (
  index: number,
  address?: string
): Promise<Agreement> => {
  return getContract().getAgreement(address || (await getAddress()), index);
};

export const getSignatures = async (page = 1): Promise<ESignaturePacket[]> => {
  return getContract().getSignatures(await getAddress(), (page - 1) * 10);
};

export const getSignature = async (
  index: number
): Promise<ESignaturePacket> => {
  return getContract().getSignature(await getAddress(), index);
};

export const sign = async ({
  agreement,
  identifier,
  encryptedCid,
}: {
  agreement: Agreement;
  identifier: string;
  encryptedCid: string;
}) => {
  return (
    await getContract().sign(
      agreement.owner,
      agreement.index,
      identifier,
      encryptedCid
    )
  ).wait(1);
};
