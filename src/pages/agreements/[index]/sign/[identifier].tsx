import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sign from "../../../../components/agreements/Sign";
import { toast } from "react-toastify";
import { useIPFS } from "../../../../providers/IPFSProvider";
import {
  downloadAndDecrypt,
  encryptAgreementAndPin,
} from "../../../../utils/files";
import {
  Agreement,
  getAgreement,
  sign,
  signMessage,
} from "../../../../services/digitalSignature";

const SignAgreementPage: NextPage = () => {
  const router = useRouter();
  const ipfs = useIPFS();
  const [agreement, setAgreement] = useState<Agreement>();

  const index = Number(router.query.index as string);
  const identifier = router.query.identifier as string;
  const encryptionPW = decodeURIComponent(router.query.pw as string);
  const signature = agreement?.constraints.find(
    (constraint) => constraint.identifier === identifier
  );

  const refetchAgreement = useCallback(async () => {
    setAgreement(await getAgreement(index));
  }, [router.query.address]);

  const handleSign = useCallback(async () => {
    try {
      if (!ipfs) throw new Error("IPFS not loaded");
      if (!agreement) throw new Error("Missing agreement");

      const pdf = await downloadAndDecrypt({
        encryptionPWBytes: new Uint8Array(Buffer.from(encryptionPW, "base64")),
        cid: agreement.encryptedCid,
      });

      const encryptionPWBytes = await signMessage(
        `Encrypt PDF for ${agreement.identifier}`
      );

      const cid = await encryptAgreementAndPin({
        encryptionPWBytes,
        pdf,
        name: `Signature - ${identifier} on ${agreement.identifier}`,
      });

      await sign({
        agreement,
        identifier,
        encryptedCid: cid,
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
