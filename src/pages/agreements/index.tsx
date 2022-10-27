import type { NextPage } from "next";
import AgreementList from "../../components/agreements/AgreementList";
import Link from "next/link";
import Button from "../../components/common/Button";
import { useEffect, useState } from "react";
import { Agreement, getAgreements } from "../../services/solana";

const AgreementsPage: NextPage = () => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  useEffect(() => {
    (async () => {
      setAgreements(await getAgreements());
    })();
  }, []);

  return (
    <>
      <h2 className="mb-2 text-2xl">Agreements</h2>
      <Link href="/agreements/create">
        <div className="flex justify-end">
          <Button
            color="bg-fuchsia-500"
            hoverColor="bg-fuchsia-400"
            text="Create Agreement"
            iconName="add"
          />
        </div>
      </Link>
      <AgreementList agreements={agreements} />
    </>
  );
};

export default AgreementsPage;
