import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";
import {
  AgreementWithSignatures,
  getAgreement,
  signAgreement,
} from "../../../../services/solana";
import Sign from "../../../../components/agreements/Sign";
import { toast } from "react-toastify";
import nacl from "tweetnacl";
import { useWallet } from "@solana/wallet-adapter-react";
import { useIPFS } from "../../../../providers/IPFSProvider";
import {
  downloadAndDecrypt,
  encryptAgreementAndPin,
} from "../../../../utils/files";

const SignAgreementPage: NextPage = () => {
  const router = useRouter();
  const ipfs = useIPFS();
  const { signMessage } = useWallet();
  const [agreement, setAgreement] = useState<AgreementWithSignatures>();

  const index = Number(router.query.index as string);
  const encryptionPW = decodeURIComponent(router.query.pw as string);
  const signature = agreement?.signatures[Number()];

  const refetchAgreement = useCallback(async () => {
    setAgreement(
      await getAgreement(new PublicKey(router.query.address as string))
    );
  }, [router.query.address]);

  const handleSign = useCallback(async () => {
    try {
      if (!ipfs) throw new Error("IPFS not loaded");
      if (!signMessage) throw new Error("Wallet not connected");
      if (!agreement) throw new Error("Missing agreement");

      const pdf = await downloadAndDecrypt({
        encryptionPWBytes: new Uint8Array(Buffer.from(encryptionPW, "base64")),
        cid: agreement.encryptedCid,
      });

      const encryptionPWBytes = await signMessage(
        Buffer.from(`Encrypt PDF for ${agreement.address}`)
      );

      const { cid } = await encryptAgreementAndPin({
        encryptionPWBytes,
        pdf: Buffer.from(pdf),
        name: `Signature - ${index} on ${agreement.address}`,
      });

      await signAgreement({
        index,
        encryptedCid: cid,
        agreementAddress: agreement.address,
      });

      await refetchAgreement();
      toast.success("Signature complete");
    } catch (e: any) {
      toast.error(`Error signing agreement: ${e.message}`);
    }
  }, [signMessage, agreement, ipfs, index, refetchAgreement, encryptionPW]);

  useEffect(() => {
    refetchAgreement();
  }, [refetchAgreement]);

  if (!agreement || !signature) return null;

  return (
    <>
      <Sign
        agreement={agreement}
        signature={signature}
        encryptionPW={encryptionPW}
        onSign={handleSign}
      />
    </>
  );
};

export default SignAgreementPage;
