/* eslint-disable indent */
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { create, IPFS } from "ipfs-core";

const IPFSContext = createContext<IPFS | null>(null);

const ipfsPromise =
  typeof window !== "undefined"
    ? create({ start: false }).then((ipfs) => {
        ipfs.start();
        return ipfs;
      })
    : null;

export const IPFSProvider = ({ children }: { children: ReactNode }) => {
  const [ipfs, setIpfs] = useState<IPFS | null>(null);

  useEffect(() => {
    let ipfs: IPFS;
    (async () => {
      ipfs = (await ipfsPromise) as IPFS;
      setIpfs(ipfs);
    })();

    return () => void ipfs?.stop();
  }, []);

  return <IPFSContext.Provider value={ipfs}>{children}</IPFSContext.Provider>;
};

export const useIPFS = () => {
  return useContext(IPFSContext);
};
