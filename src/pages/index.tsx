import type { NextPage } from "next";
import { DocumentIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useProfile } from "../services/digitalSignatures";

const Home: NextPage = () => {
  const { profile } = useProfile();
  const agreementCount = profile?.totalAgreements.toNumber();
  const signatureCount = profile?.totalSignatures.toNumber();

  return (
    <>
      <section className="mb-6 flex gap-20">
        <div className="relative">
          <dt>
            <div className="absolute flex h-16 w-16 items-center justify-center rounded-md bg-slate-900 text-white">
              <DocumentIcon className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="text-md ml-20 leading-6 text-slate-400">Agreements</p>
          </dt>
          <dd className="ml-20 text-3xl font-semibold text-slate-900">
            {agreementCount ?? "loading"}
          </dd>
        </div>

        <div className="relative">
          <dt>
            <div className="absolute flex h-16 w-16 items-center justify-center rounded-md bg-slate-900 text-white">
              <PencilIcon className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="text-md ml-20 leading-6 text-slate-400">Signatures</p>
          </dt>
          <dd className="ml-20 text-3xl font-semibold text-slate-900">
            {signatureCount ?? "loading"}
          </dd>
        </div>
      </section>
    </>
  );
};

export default Home;
