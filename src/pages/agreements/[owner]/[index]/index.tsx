import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AgreementDetails from "../../../../components/agreements/AgreementDetails";
import {
  Agreement,
  getAgreement,
} from "../../../../services/digitalSignatures";
import Button from "../../../../components/common/Button";
import { deployProviderNFTDealClient } from "../../../../services/filecoinDealClients";

const AgreementDetailsPage: NextPage = () => {
  const router = useRouter();
  const [agreement, setAgreement] = useState<Agreement>();

  useEffect(() => {
    (async () => {
      setAgreement(await getAgreement(Number(router.query.index)));
    })();
  }, [router]);

  return (
    <>
      {agreement ? (
        <>
          {" "}
          <Button
            text="test"
            onClick={() => deployProviderNFTDealClient(agreement)}
          />
          <AgreementDetails agreement={agreement} />
        </>
      ) : null}
    </>
  );
};

export default AgreementDetailsPage;
