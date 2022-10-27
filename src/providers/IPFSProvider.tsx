import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { create, IPFS } from "ipfs-core";

const IPFSContext = createContext<IPFS | null>(null);

const ipfsPromise = create({ offline: true, start: false }).then((ipfs) => {
  if (window) ipfs.start();
  return ipfs;
});

export const IPFSProvider = ({ children }: { children: ReactNode }) => {
  const [ipfs, setIpfs] = useState<IPFS | null>(null);

  useEffect(() => {
    let ipfs: IPFS;
    (async () => {
      ipfs = await ipfsPromise;
      setIpfs(ipfs);
    })();

    return () => void ipfs?.stop();
  }, []);

  return <IPFSContext.Provider value={ipfs}>{children}</IPFSContext.Provider>;
};

export const useIPFS = () => {
  return useContext(IPFSContext);
};
