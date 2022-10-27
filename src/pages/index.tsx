import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import type { NextPage } from "next";
import SidebarLayout from "../components/layouts/SidebarLayout";
import { SendSolanaToAddress } from "../components/layouts/Solana/Utils/sendSolana";

const Home: NextPage = () => {
  return (
    <SidebarLayout>
      <h1>Home</h1>
      <WalletMultiButton />
      <SendSolanaToAddress/>
    </SidebarLayout>
  );
};

export default Home;
