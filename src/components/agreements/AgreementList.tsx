import Link from "next/link";
import Badge from "../common/Badge";
import { Agreement } from "../../services/solana";

const colorByStatus = {
  pending: "bg-yellow-500",
  complete: "bg-indigo-500",
  approved: "bg-teal-500",
  rejected: "bg-rose-500",
};

export default function AgreementList({
  agreements,
}: {
  agreements: Agreement[];
}) {
  const agreementsDisplay = agreements.map((agreement) => (
    <li key={agreement.address.toString()}>
      <Link
        href={`/agreements/${agreement.address}`}
        as={`/agreements/${agreement.address}`}
      >
        <a
          className="m-2 flex items-center gap-20 rounded p-4 outline outline-dashed outline-1 outline-purple-200 hover:bg-purple-50"
          href="#"
        >
          <section className="basis-2/5">
            <p className="font-semibold">{agreement.identifier}</p>
            <p>{agreement.cid}</p>
            <Badge
              className="w-36"
              color={colorByStatus[agreement.status]}
              text={agreement.status}
            />
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
