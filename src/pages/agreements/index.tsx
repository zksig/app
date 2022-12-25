import type { NextPage } from "next";
import AgreementList from "../../components/agreements/AgreementList";
import Link from "next/link";
import Button from "../../components/common/Button";
import { useAgreements } from "../../services/digitalSignatures";

const AgreementsPage: NextPage = () => {
  const { agreements } = useAgreements();

  return (
    <>
      <h2 className="mb-2 text-2xl">Agreements</h2>
      <div className="flex justify-end">
        <Link href="/agreements/create">
          <Button text="Create Agreement" iconName="add" className="mr-2" />
        </Link>
      </div>
      <AgreementList agreements={agreements} />
    </>
  );
};

export default AgreementsPage;
