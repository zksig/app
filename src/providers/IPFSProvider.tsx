import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { create, IPFS } from "ipfs-core";

const IPFSContext = createContext<IPFS | null>(null);

export const IPFSProvider = ({ children }: { children: ReactNode }) => {
  const [ipfs, setIpfs] = useState<IPFS | null>(null);

  useEffect(() => {
    (async () => {
      setIpfs(await create({ offline: true }));
    })();
  }, []);

  return <IPFSContext.Provider value={ipfs}>{children}</IPFSContext.Provider>;
};

export const useIPFS = () => {
  return useContext(IPFSContext);
};
