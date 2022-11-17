import type { NextPage } from "next";
import AgreementList from "../../components/agreements/AgreementList";
import Link from "next/link";
import Button from "../../components/common/Button";
import { useEffect, useState } from "react";
import { Agreement, getAgreements } from "../../services/filecoin";

const AgreementsPage: NextPage = () => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  useEffect(() => {
    (async () => {
      setAgreements(await getAgreements());
    })();
  }, []);

  console.log(agreements);

  return (
    <>
      <h2 className="mb-2 text-2xl">Agreements</h2>
      <div className="flex justify-end">
        <Link href="/agreements/create">
          <Button text="Create Agreement" iconName="add" />
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
