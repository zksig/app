import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import WalletButton from "../components/common/WalletButton";
import { getAddress, getProvider } from "../services/filecoin";

const FilecoinContext = createContext<{
  address: string;
  isConnected: boolean;
}>({
  address: "",
  isConnected: false,
});

export const FilecoinProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const provider = getProvider();

    (async () => {
      try {
        setAddress(await getAddress());
      } catch {
        toast.error("Unable to check connection");
      } finally {
        setIsLoading(false);
      }
    })();

    provider.on("eth_accounts", async () => {
      try {
        setAddress(await getAddress());
      } catch {
        toast.error("Unable to check connection");
      } finally {
        setIsLoading(false);
      }
    });

    return () => void provider.off("eth_accounts");
  }, []);

  if (isLoading) return null;
  if (!address) {
    return (
      <section className="flex h-screen w-screen items-center justify-center bg-slate-900">
        <WalletButton />
      </section>
    );
  }

  return (
    <FilecoinContext.Provider value={{ address, isConnected: !!address }}>
      {children}
    </FilecoinContext.Provider>
  );
};

export const useProviderIsConnected = () => {
  const { isConnected } = useContext(FilecoinContext);
  return isConnected;
};

export const useWalletAddress = () => {
  const { address } = useContext(FilecoinContext);
  return address;
};
