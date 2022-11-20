import type { NextPage } from "next";
import AgreementList from "../../components/agreements/AgreementList";
import Link from "next/link";
import Button from "../../components/common/Button";
import { useEffect, useState } from "react";
import { Agreement, getAgreements } from "../../services/digitalSignatures";

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
      <div className="flex justify-end">
        <Link href="/agreements/create">
          <Button text="Create Agreement" iconName="add" className="mr-16" />
        </Link>
        <Link href="/agreements/create-new">
          <Button text="(new) Create Agreement" iconName="add" />
        </Link>
      </div>
      <AgreementList agreements={agreements} />
    </>
  );
};

export default AgreementsPage;
