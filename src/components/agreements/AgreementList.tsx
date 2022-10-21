import { Agreement } from "@prisma/client";
import Link from "next/link";
import moment from "moment";
import Badge from "../common/Badge";

export default function AgreementList({
  agreements,
}: {
  agreements: Agreement[];
}) {
  const agreementsDisplay = agreements.map((agreement) => (
    <li key={agreement.id}>
      <Link href={`/agreements/${agreement.id}`}>
        <a
          className="m-2 flex items-center gap-2 rounded p-4 outline outline-dashed outline-1 outline-purple-200 hover:bg-purple-50"
          href="#"
        >
          <section className="basis-1/2">
            <p className="font-semibold">Agreement Name</p>
            <p>{agreement.cid}</p>
            <Badge
              className="w-36 bg-slate-900"
              text={moment(agreement.createdAt).fromNow()}
            />
          </section>
          <section className="flex grow basis-1/5 flex-wrap justify-start gap-1">
            {Object.keys(agreement.description || {}).map((key) => (
              <Badge text={key} key={key} />
            ))}
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
