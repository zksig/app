import { BigNumber, constants, Contract, providers } from "ethers";
import { getChainIds, getNetwork, getProvider, supportedNetworks } from "./evm";
import DigitalSignature from "../utils/DigitalSignature.json";

export type Profile = {
  totalAgreements: number;
  totalSignatures: number;
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

export const getContract = async ({
  network = getNetwork(),
  chainId,
}: {
  network?: string;
  chainId?: number;
} = {}) => {
  const provider = getProvider({ network, chainId });
  if (!chainId) {
    const network = await provider.getNetwork();
    chainId = network.chainId;
  }

  const contract = new Contract(
    supportedNetworks[network][chainId]?.contract,
    DigitalSignature.abi,
    provider
  );

  if (provider instanceof providers.Web3Provider) {
    contract.connect(provider.getSigner());
  }

  return contract;
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
  const profiles = await Promise.all(
    getChainIds().map(async (chainId) => {
      return (await getContract({ chainId: Number(chainId) })).getProfile();
    })
  );

  return profiles.reduce(
    (acc, profile) => ({
      totalAgreements: acc.totalAgreements + profile.totalAgreements.toNumber(),
      totalSignatures: acc.totalSignatures + profile.totalSignatures.toNumber(),
    }),
    { totalAgreements: 0, totalSignatures: 0 }
  );
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

  const contract = await getContract();
  return (
    await contract.createAgreement({
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
  const contract = await getContract();
  return contract.getAgreements(await getAddress(), (page - 1) * 10, 10);
};

export const getAgreement = async (
  index: number,
  address?: string
): Promise<Agreement> => {
  const contract = await getContract();
  return (
    await contract.getAgreements(address || (await getAddress()), index, 1)
  )[0];
};

export const getSignatures = async (page = 1): Promise<SignaturePacket[]> => {
  const contract = await getContract();
  return contract.getSignatures(await getAddress(), (page - 1) * 10, 10);
};

export const getSignature = async (index: number): Promise<SignaturePacket> => {
  const contract = await getContract();
  return (await contract.getSignatures(await getAddress(), index, 1))[0];
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
  const contract = await getContract();

  return (
    await contract.sign(
      agreement.owner,
      agreement.index,
      identifier,
      encryptedCid
    )
  ).wait(1);
};
