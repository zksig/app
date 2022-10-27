import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <h1>Home</h1>
      <WalletMultiButton />
    </>
  );
};

export default Home;
