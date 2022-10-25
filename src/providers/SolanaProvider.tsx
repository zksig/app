import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import SidebarLayout from "../components/layouts/SidebarLayout";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { IDL } from "../utils/e_signatures";

const SolanaContext = createContext<{
  program: Program<typeof IDL> | null;
  provider: AnchorProvider | null;
}>({
  program: null,
  provider: null,
});

const programId = new PublicKey("FqUDkQ5xq2XE7BecTN8u9R28xtLudP7FgCTC8vSLDEwL");

const verifyToken = async (publicKey: PublicKey) => {
  const res = await fetch("/api/auth/solana");
  if (!res.ok) {
    return false;
  }

  return (await res.json()).publicKey === publicKey.toString();
};

const getToken = async (
  signMessage: (message: Uint8Array) => Promise<Uint8Array>,
  publicKey: PublicKey
) => {
  const date = Date.now();

  const signature = await signMessage(
    Buffer.from(`ZKSIG AUTH SOLANA - ${date}`)
  );

  const res = await fetch("/api/auth/solana", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      signature: Buffer.from(signature).toString("base64"),
      date,
      publicKey,
    }),
  });

  if (!res.ok) throw new Error("Unable to verify publicKey");
};

export const SolanaProvider = ({ children }: { children: ReactNode }) => {
  const { connection } = useConnection();
  const { publicKey, wallet, signMessage, connected } = useWallet();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const provider = new AnchorProvider(
    connection,
    // @ts-ignore
    { ...wallet?.adapter, publicKey },
    {}
  );
  const program = new Program(IDL, programId, provider);

  useEffect(() => {
    if (!connected || !signMessage || !publicKey) return;
    (async () => {
      try {
        if (!(await verifyToken(publicKey)))
          await getToken(signMessage, publicKey);
        setVerified(true);
      } catch {
        toast.error("Unable to verify public key");
      } finally {
        setLoading(false);
      }
    })();
  }, [connected, signMessage, publicKey]);

  return (
    <SolanaContext.Provider value={{ program, provider }}>
      {verified ? (
        children
      ) : (
        <SidebarLayout>
          <WalletMultiButton />
        </SidebarLayout>
      )}
    </SolanaContext.Provider>
  );
};

export const useSolana = () => {
  return useContext(SolanaContext);
};
