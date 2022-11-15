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

let selectedNetwork =
  typeof window !== "undefined"
    ? localStorage.getItem("PROVIDER_NETWORK") || "wallaby"
    : "wallaby";

const networks: Record<
  string,
  {
    chainId: string;
    contractAddress: string;
  }
> = {
  sepolia: {
    chainId: `0x${(11155111).toString(16)}`,
    contractAddress: "0x1e7ef1a8f6b6710c6541dbacf36c4b9173712b6a",
  },
  wallaby: {
    chainId: `0x${(31415).toString(16)}`,
    contractAddress: "0x92Af8EFb9A433b232398fB6D801d080aE44AaB21",
  },
};

export const getProvider = () => {
  const provider = new providers.Web3Provider(
    typeof window !== "undefined"
      ? window.ethereum
      : new providers.JsonRpcProvider("https://wallaby.node.glif.io/rpc/v0")
  );

  return provider;
};

export const getContract = () => {
  const provider = getProvider();
  const contract = new Contract(
    process.env.NEXT_PUBLIC_FILECOIN_CONTRACT ||
      networks[selectedNetwork].contractAddress,
    ESignature.abi,
    provider
  );

  return contract.connect(provider.getSigner());
};

export const connect = async (network: "sepolia" | "wallaby") => {
  localStorage.setItem("PROVIDER_NETWORK", network);
  selectedNetwork = network;
  const provider = await getProvider();
  const [account] = await provider.send("eth_requestAccounts", []);
  await provider.send("wallet_switchEthereumChain", [
    { chainId: networks[network].chainId },
  ]);

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
