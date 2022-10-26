import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";
import SidebarLayout from "../../../../components/layouts/SidebarLayout";
import {
  AgreementWithSignatures,
  getAgreement,
  signAgreement,
} from "../../../../services/solana";
import Sign from "../../../../components/agreements/Sign";
import { toast } from "react-toastify";

const SignAgreementPage: NextPage = () => {
  const router = useRouter();
  const [agreement, setAgreement] = useState<AgreementWithSignatures>();

  const refetchAgreement = useCallback(async () => {
    setAgreement(
      await getAgreement(new PublicKey(router.query.address as string))
    );
  }, [router.query.address]);

  useEffect(() => {
    refetchAgreement();
  }, [refetchAgreement]);

  if (!agreement) return null;

  return (
    <SidebarLayout>
      <Sign
        agreement={agreement}
        index={Number(router.query.index as string)}
        onSign={async (index: number) => {
          await signAgreement({ index, agreementAddress: agreement.address });
          await refetchAgreement();
          toast.success("Signature complete");
        }}
      />
    </SidebarLayout>
  );
};

export default SignAgreementPage;
