import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import Button from "../components/common/Button";
import {
  createSolanaProfile,
  getSolanaProfile,
  SolanaProfile,
} from "../services/solana";

type SolanaContext = {
  profile: SolanaProfile | undefined;
};

const SolanaContext = createContext<SolanaContext>({
  profile: undefined,
});

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
  const { publicKey, signMessage } = useWallet();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [profile, setProfile] = useState<SolanaProfile>();

  const fetchProfile = useCallback(async () => {
    try {
      return await getSolanaProfile();
    } catch (e) {
      return;
    }
  }, []);

  useEffect(() => {
    if (!signMessage || !publicKey) return;
    (async () => {
      try {
        if (!(await verifyToken(publicKey)))
          await getToken(signMessage, publicKey);
        setVerified(true);
        setProfile(await fetchProfile());
      } catch (e) {
        toast.error("Unable to verify public key");
      } finally {
        setLoading(false);
      }
    })();
  }, [signMessage, publicKey, fetchProfile]);

  if (!publicKey) {
    return <WalletMultiButton style={{ background: "#a855f7" }} />;
  }

  if (loading) return null;

  if (!profile) {
    return (
      <Button
        text="Create Account"
        onClick={async () => {
          try {
            await createSolanaProfile();
            setProfile(await getSolanaProfile());
          } catch (e: any) {
            toast.error(e);
          }
        }}
      />
    );
  }

  return (
    <SolanaContext.Provider
      value={{
        profile,
      }}
    >
      {children}
    </SolanaContext.Provider>
  );
};

export const useSolana = () => {
  return useContext(SolanaContext);
};