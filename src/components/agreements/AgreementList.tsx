import { ethers } from "ethers";
import Link from "next/link";
import { Agreement } from "../../services/digitalSignatures";
import { colorByStatus, statusTitle } from "../../utils/ui";
import Badge from "../common/Badge";

export default function AgreementList({
  agreements,
}: {
  agreements: Agreement[];
}) {
  const agreementsDisplay = agreements.map((agreement) => (
    <li key={agreement.index.toString()}>
      <Link href={`/agreements/${agreement.owner}/${agreement.index}`}>
        <a
          className="m-2 flex items-center gap-20 rounded p-4 outline outline-dashed outline-1 outline-purple-200 hover:bg-purple-50"
          href={`/agreements/${agreement.index}`}
        >
          <section className="basis-2/5">
            <p className="font-semibold">{agreement.identifier}</p>
            <p>{agreement.cid}</p>
            <div className="flex gap-1">
              <Badge
                className="w-36"
                color={colorByStatus[agreement.status]}
                text={statusTitle[agreement.status]}
              />
              {agreement.nftContractAddress !== ethers.constants.AddressZero ? (
                <Badge className="w-12" color="bg-fuchsia-500" text="NFT" />
              ) : null}
            </div>
          </section>
          <section className="flex grow">
            <div className="mb-4 h-1.5 w-full rounded-full bg-slate-600">
              <div
                className="h-1.5 rounded-full bg-teal-500"
                style={{
                  width: `${
                    (agreement.signedPackets / agreement.totalPackets) * 100
                  }%`,
                }}
              ></div>
              <div className="mt-2 text-center font-medium">
                {(
                  (agreement.signedPackets / agreement.totalPackets) *
                  100
                ).toFixed(0)}
                % signed
              </div>
            </div>
          </section>
          <section>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </section>
        </a>
      </Link>
    </li>
  ));

  return <ul>{agreementsDisplay}</ul>;
}
