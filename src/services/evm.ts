import { providers } from "ethers";

export const supportedNetworks: Record<
  string,
  Record<number, { contract: string; url: string }>
> = {
  dev: {
    31415: {
      contract:
        process.env.NEXT_PUBLIC_FILECOIN_CONTRACT ||
        "0x55A66ED1B6949Fa0A9F282b1c80E3c983E52f5Aa",
      url: "https://wallaby.node.glif.io/rpc/v0",
    },
    11155111: {
      contract:
        process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT ||
        "0x7966833305d155B6411a0E0bAAD1ec8894F9319F",
      url: "https://rpc.sepolia.org",
    },
  },
  main: {},
};

export const getNetwork = () => {
  return process.env.NEXT_PUBLIC_NETWORK || "dev";
};

export const getChainIds = () => {
  const network = getNetwork();
  return Object.keys(supportedNetworks[network]);
};

export const getProvider = ({
  network = getNetwork(),
  chainId = 31415,
}: {
  network?: string;
  chainId?: number;
} = {}) => {
  if (
    typeof window !== "undefined" &&
    Number(window.ethereum.chainId) === chainId
  ) {
    return new providers.Web3Provider(window.ethereum);
  } else {
    return new providers.JsonRpcProvider(supportedNetworks[network][chainId]);
  }
};
