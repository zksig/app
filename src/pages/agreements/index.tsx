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
    <div className="grid grid-cols-5">
      <div className="col-span-4">
        <h2 className="mb-2 text-2xl font-semibold text-gray-500">
          Agreements
        </h2>
      </div>
      <div className="col-span-1">
        <Link href="/agreements/create">
          <div className="-my-4 flex justify-end">
            <Button
              color="bg-fuchsia-500"
              hoverColor="bg-fuchsia-400"
              text="Create Agreement"
              iconName="add"
            />
          </div>
        </Link>
        <Link href="/agreements/create-new">
          <div className="-my-4 flex justify-end">
            <Button
              color="bg-fuchsia-500"
              hoverColor="bg-fuchsia-400"
              text="(New) Create Agreement"
              iconName="add"
            />
          </div>
        </Link>
      </div>
      <div className="col-span-5">
        <AgreementList agreements={agreements} />
      </div>
    </div>
  );
};

export default AgreementsPage;
