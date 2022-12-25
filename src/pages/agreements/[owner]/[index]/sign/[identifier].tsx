import type { NextPage } from "next";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Sign from "../../../../../components/agreements/Sign";
import {
  useAgreement,
  useDigitalSignatureContract,
  useSign,
} from "../../../../../services/digitalSignatures";

const SignAgreementPage: NextPage = () => {
  const router = useRouter();
  const contract = useDigitalSignatureContract();
  const sign = useSign();

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
      if (!agreement) throw new Error("Missing agreement");

      const pdf = await contract.getAgreementPDF(
        agreement,
        Buffer.from(encryptionPW, "base64")
      );

      await sign({
        agreement,
        identifier,
        pdf,
      });

      await refetch();
      toast.success("Signature complete");
    } catch (e: any) {
      toast.error(`Error signing agreement: ${e.message}`);
    }
  }, [contract, agreement, encryptionPW, identifier, refetch, sign]);

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
