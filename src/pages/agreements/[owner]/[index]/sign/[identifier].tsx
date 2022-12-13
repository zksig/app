import type { NextPage } from "next";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useSignMessage } from "wagmi";
import { useIPFS } from "../../../../../providers/IPFSProvider";
import Sign from "../../../../../components/agreements/Sign";
import {
  downloadAndDecrypt,
  encryptAgreementAndPin,
} from "../../../../../utils/files";
import {
  useAgreement,
  useSign,
} from "../../../../../services/digitalSignatures";

const SignAgreementPage: NextPage = () => {
  const router = useRouter();
  const sign = useSign();
  const ipfs = useIPFS();
  const { signMessageAsync } = useSignMessage();

  const index = Number(router.query.index as string);
  const identifier = router.query.identifier as string;
  const encryptionPW = decodeURIComponent(router.query.pw as string);
  const { agreement, refetch } = useAgreement({
    address: router.query.owner as string,
    index,
  });
  const signature = agreement?.constraints.find(
    (constraint) => constraint.identifier === identifier
  );

  const handleSign = useCallback(async () => {
    try {
      if (!ipfs) throw new Error("IPFS not loaded");
      if (!agreement) throw new Error("Missing agreement");

      const pdf = await downloadAndDecrypt({
        encryptionPWBytes: new Uint8Array(Buffer.from(encryptionPW, "base64")),
        cid: agreement.encryptedCid,
      });

      const encryptionPWBytes = Buffer.from(
        await signMessageAsync({
          message: `Encrypt PDF for ${agreement.identifier}`,
        })
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

      await refetch();
      toast.success("Signature complete");
    } catch (e: any) {
      toast.error(`Error signing agreement: ${e.message}`);
    }
  }, [
    signMessageAsync,
    identifier,
    sign,
    agreement,
    ipfs,
    refetch,
    encryptionPW,
  ]);

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
