import Link from "next/link";
import Badge from "../common/Badge";
import { Agreement, SignaturePacket } from "../../services/solana";

const colorByStatus = {
  pending: "bg-yellow-500",
  complete: "bg-indigo-500",
  approved: "bg-teal-500",
  rejected: "bg-rose-500",
};

export default function SignatureList({
  signatures,
}: {
  signatures: SignaturePacket[];
}) {
  console.log(signatures);
  const signaturesDisplay = signatures.map((signature) => (
    <li key={signature.address.toString()}>
      <Link href={`/signatures/${signature.address}`}>
        <a
          className="m-2 flex items-center justify-between gap-20 rounded p-4 outline outline-dashed outline-1 outline-purple-200 hover:bg-purple-50"
          href="#"
        >
          <section className="basis-2/5">
            <p className="font-semibold">{signature.identifier}</p>
            <p>{signature.signer.toString()}</p>
            <Badge
              className="w-36"
              color={signature.signed ? "bg-teal-500" : "bg-yellow-500"}
              text={signature.signed ? "Signed" : "Unsigned"}
            />
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

  return <ul>{signaturesDisplay}</ul>;
}