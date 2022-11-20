import { providers } from "ethers";

export const getProvider = () => {
  const provider = new providers.Web3Provider(
    typeof window !== "undefined"
      ? window.ethereum
      : new providers.JsonRpcProvider("https://wallaby.node.glif.io/rpc/v0")
  );

  return provider;
};
