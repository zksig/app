import React from "react";
import { ConnectKitProvider } from "connectkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygonMumbai, sepolia } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const wallaby = {
  id: 31415,
  name: "Filecoin - Wallaby testnet",
  network: "Wallaby",
  nativeCurrency: { name: "tFil", symbol: "tFil", decimals: 6 },
  rpcUrls: { default: { http: ["https://wallaby.node.glif.io/rpc/v0"] } },
  testnet: true,
};

const { provider, chains } = configureChains(
  [polygonMumbai, sepolia, wallaby],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider mode="light">{children}</ConnectKitProvider>
    </WagmiConfig>
  );
};
