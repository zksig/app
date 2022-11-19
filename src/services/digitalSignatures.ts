import { BigNumber, constants, Contract, providers } from "ethers";
import DigitalSignature from "../utils/DigitalSignature.json";
import { getProvider } from "./evm";

export type Profile = {
  totalAgreements: BigNumber;
  totalSignatures: BigNumber;
};

export type SignatureConstraint = {
  identifier: string;
  signer: string;
  totalUsed: BigNumber;
  allowedToUse: BigNumber; // set to 0 for unlimited
};

export type Agreement = {
  owner: string;
  status: number;
  index: BigNumber;
  identifier: string;
  cid: string;
  encryptedCid: string;
  descriptionCid: string;
  signedPackets: number;
  totalPackets: number;
  nftContractAddress?: string;
  constraints: SignatureConstraint[];
};

export type SignaturePacket = {
  agreementOwner: string;
  agreementIndex: BigNumber;
  index: BigNumber;
  identifier: string;
  encryptedCid: string;
  signer: string;
  nftContractAddress?: string;
  nftTokenId?: BigNumber;
  timestamp: number;
  blockNumber: number;
};

export const getContract = () => {
  const provider = getProvider();
  const contract = new Contract(
    process.env.NEXT_PUBLIC_FILECOIN_CONTRACT ||
      "0x55A66ED1B6949Fa0A9F282b1c80E3c983E52f5Aa",
    DigitalSignature.abi,
    provider
  );

  return contract.connect(provider.getSigner());
};

export const connect = async () => {
  const provider = await getProvider();
  const [account] = await provider.send("eth_requestAccounts", []);

  return account;
};

export const getAddress = async () => {
  return (await getProvider().send("eth_accounts", []))[0];
};

export const getIsConnected = async () => {
  return (await getProvider().send("eth_accounts", [])).length > 0;
};
export const signMessage = async (message: string) => {
  return Uint8Array.from(
    Buffer.from(await getProvider().getSigner().signMessage(message))
  );
};

export const getProfile = async (): Promise<Profile> => {
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
    signer: constants.AddressZero,
    totalUsed: 0,
    allowedToUse: 1,
  }));

  return (
    await getContract().createAgreement({
      identifier,
      cid,
      encryptedCid,
      descriptionCid,
      withNFT: false,
      nftImageCid: "",
      constraints,
    })
  ).wait(1);
};

export const getAgreements = async (page = 1): Promise<Agreement[]> => {
  return getContract().getAgreements(await getAddress(), (page - 1) * 10, 10);
};

export const getAgreement = async (
  index: number,
  address?: string
): Promise<Agreement> => {
  return (
    await getContract().getAgreements(address || (await getAddress()), index, 1)
  )[0];
};

export const getSignatures = async (page = 1): Promise<SignaturePacket[]> => {
  return getContract().getSignatures(await getAddress(), (page - 1) * 10, 10);
};

export const getSignature = async (index: number): Promise<SignaturePacket> => {
  return (await getContract().getSignatures(await getAddress(), index, 1))[0];
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
