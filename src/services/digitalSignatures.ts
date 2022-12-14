import { BigNumber, constants } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useContract, useNetwork, useSigner } from "wagmi";
import DigitalSignature from "./contracts/DigitalSignature.json";

export type Profile = {
  totalAgreements: BigNumber;
  totalSignatures: BigNumber;
};

export type SignatureConstraint = {
  identifier: string;
  signer: string;
  totalUsed: BigNumber;
  allowedToUse: BigNumber; // set to 0 for unlimited
};

export type Agreement = {
  owner: string;
  status: number;
  index: BigNumber;
  identifier: string;
  cid: string;
  encryptedCid: string;
  descriptionCid: string;
  signedPackets: number;
  totalPackets: number;
  constraints: SignatureConstraint[];
  agreementCallback: string;
  signatureCallback: string;
};

export type SignaturePacket = {
  agreementOwner: string;
  agreementIndex: BigNumber;
  index: BigNumber;
  identifier: string;
  encryptedCid: string;
  signer: string;
  timestamp: number;
  blockNumber: number;
};

const contractAddresses: Record<string, string> = {
  80001: "0xe98a7d8Dafc6b6f9c55E1382eF1EB1996edcA4d4",
  11155111: "0x75f7ec65361FAA30c83c4D516D21EF3fFFdb15A4",
  31415: "0x0C8a04faB35dc3239AC4e88F26903CF46Bd0bA47",
};

const nftFactoryAddress: Record<string, string> = {
  80001: "0x7966833305d155B6411a0E0bAAD1ec8894F9319F",
  11155111: "0xA674B918Cb7FE8cE72584A9841B21A58DC1584F8",
  31415: "0xA674B918Cb7FE8cE72584A9841B21A58DC1584F8",
};

export const useDigitalSignatureContract = () => {
  const network = useNetwork();
  const { data: signer } = useSigner();
  const contract = useContract({
    address: contractAddresses[network.chain?.id || "11155111"],
    abi: DigitalSignature.abi,
    signerOrProvider: signer,
  });

  return contract;
};

export const useProfile = (): {
  isLoading: boolean;
  profile?: Profile;
} => {
  const [profile, setProfile] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const contract = useDigitalSignatureContract();

  useEffect(() => {
    if (!contract) return;
    (async () => {
      try {
        setProfile(await contract?.getProfile());
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [contract]);

  return {
    isLoading,
    profile,
  };
};

export const useCreateAgreement = () => {
  const network = useNetwork();
  const contract = useDigitalSignatureContract();

  return async ({
    identifier,
    cid,
    encryptedCid,
    descriptionCid,
    description,
    withNFT,
  }: {
    identifier: string;
    cid: string;
    encryptedCid: string;
    descriptionCid: string;
    description: { identifier: string; fields: string[] }[];
    withNFT: boolean;
  }) => {
    const constraints = description.map(({ identifier }) => ({
      identifier,
      signer: constants.AddressZero,
      totalUsed: 0,
      allowedToUse: 1,
    }));
    return (
      await contract?.createAgreement({
        identifier,
        cid,
        encryptedCid,
        descriptionCid,
        constraints,
        agreementCallback: withNFT
          ? nftFactoryAddress[network.chain?.id || "11155111"]
          : constants.AddressZero,
        signatureCallback: constants.AddressZero,
        extraInfo: Buffer.from(""), // nftImageCid
      })
    ).wait(1);
  };
};

export const useAgreements = (
  page = 1
): {
  isLoading: boolean;
  agreements: Agreement[];
} => {
  const { address } = useAccount();
  const [agreements, setAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const contract = useDigitalSignatureContract();

  useEffect(() => {
    if (!contract) return;
    (async () => {
      try {
        setAgreements(
          await contract?.getAgreements(address, (page - 1) * 10, 10)
        );
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [address, page, contract]);

  return {
    isLoading,
    agreements,
  };
};

export const useAgreement = ({
  address,
  index,
}: {
  address?: string;
  index: number;
}): {
  isLoading: boolean;
  agreement?: Agreement;
  refetch: () => Promise<void>;
} => {
  const { address: defaultAddress } = useAccount();
  const [agreement, setAgreement] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const contract = useDigitalSignatureContract();

  const fetchAgreement = async () => {
    try {
      setAgreement(
        (await contract?.getAgreements(address || defaultAddress, index, 1))[0]
      );
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!contract) return;
    fetchAgreement();
  }, [address, defaultAddress, index, contract]);

  return {
    isLoading,
    agreement,
    refetch: fetchAgreement,
  };
};

export const useSignatures = (
  page = 1
): {
  isLoading: boolean;
  signatures: SignaturePacket[];
} => {
  const { address } = useAccount();
  const [signatures, setSignatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const contract = useDigitalSignatureContract();

  useEffect(() => {
    if (!contract) return;
    (async () => {
      try {
        setSignatures(
          await contract?.getSignatures(address, (page - 1) * 10, 10)
        );
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [address, page, contract]);

  return {
    isLoading,
    signatures,
  };
};

export const useSignature = ({
  address,
  index,
}: {
  address?: string;
  index: number;
}): {
  isLoading: boolean;
  signature?: SignaturePacket;
} => {
  const { address: defaultAddress } = useAccount();
  const [signature, setSignature] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const contract = useDigitalSignatureContract();

  useEffect(() => {
    if (!contract) return;
    (async () => {
      try {
        setSignature(
          (
            await contract?.getSignatures(address || defaultAddress, index, 1)
          )[0]
        );
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [address, defaultAddress, index, contract]);

  return {
    isLoading,
    signature,
  };
};

export const useSign = () => {
  const contract = useDigitalSignatureContract();

  return async ({
    agreement,
    identifier,
    encryptedCid,
  }: {
    agreement: Agreement;
    identifier: string;
    encryptedCid: string;
  }) => {
    return (
      await contract?.sign({
        agreementOwner: agreement.owner,
        agreementIndex: agreement.index,
        identifier,
        encryptedCid,
        nftTokenURI: "4234234324",
      })
    ).wait(1);
  };
};
