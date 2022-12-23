import { useCallback, useEffect, useState } from "react";
import { constants, Signer } from "ethers";
import {
  Agreement,
  Profile,
  SignaturePacket,
  ZKsigAgreement,
  ZKsigDigitalSignatureContract,
} from "@zksig/sdk";
import { useAccount, useNetwork, useSigner } from "wagmi";

const nftFactoryAddress: Record<string, string> = {
  80001: "0x7966833305d155B6411a0E0bAAD1ec8894F9319F",
  11155111: "0xA674B918Cb7FE8cE72584A9841B21A58DC1584F8",
  31415: "0xA674B918Cb7FE8cE72584A9841B21A58DC1584F8",
};

export const useDigitalSignatureContract = () => {
  const network = useNetwork();
  const { data: signer } = useSigner();
  const contract = new ZKsigDigitalSignatureContract({
    signer: signer as Signer,
    chainId: network.chain?.id,
  });

  return contract;
};

export const useProfile = (): {
  isLoading: boolean;
  profile?: Profile;
} => {
  const [profile, setProfile] = useState<Profile>();
  const [isLoading, setIsLoading] = useState(true);
  const contract = useDigitalSignatureContract();

  useEffect(() => {
    (async () => {
      try {
        setProfile(await contract.getProfile());
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
  const contract = useDigitalSignatureContract();

  return async (agreement: ZKsigAgreement) => {
    return (await contract.createAgreement(agreement)).wait(1);
  };
};

export const useAgreements = (
  page = 1
): {
  isLoading: boolean;
  agreements: Agreement[];
} => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const contract = useDigitalSignatureContract();

  useEffect(() => {
    (async () => {
      try {
        setAgreements(await contract.getAgreements({ page, perPage: 10 }));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page, contract]);

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
  const [agreement, setAgreement] = useState<Agreement>();
  const [isLoading, setIsLoading] = useState(true);
  const contract = useDigitalSignatureContract();

  const fetchAgreement = useCallback(async () => {
    try {
      setAgreement(await contract.getAgreement({ address, index }));
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, [index, contract, address]);

  useEffect(() => {
    fetchAgreement();
  }, [index, contract, address, fetchAgreement]);

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
  const [signatures, setSignatures] = useState<SignaturePacket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const contract = useDigitalSignatureContract();

  useEffect(() => {
    (async () => {
      try {
        setSignatures(await contract.getSignatures({ page, perPage: 10 }));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page, contract]);

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
  const [signature, setSignature] = useState<SignaturePacket>();
  const [isLoading, setIsLoading] = useState(true);
  const contract = useDigitalSignatureContract();

  useEffect(() => {
    (async () => {
      try {
        setSignature(await contract.getSignature({ address, index }));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [address, index, contract]);

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
    pdf,
  }: {
    agreement: Agreement;
    identifier: string;
    pdf: Uint8Array;
  }) => {
    return (
      await contract.sign({
        agreement,
        identifier,
        pdf,
      })
    ).wait(1);
  };
};
