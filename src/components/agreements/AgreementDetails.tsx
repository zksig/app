import type { AgreementWithSignatures } from "../../services/solana";
import Badge from "../common/Badge";
import { colorByStatus } from "../../utils/ui";
import Button from "../common/Button";
import { toast } from "react-toastify";

export default function AgreementDetails({
  agreement,
}: {
  agreement: AgreementWithSignatures;
}) {
  const signaturesDisplay = agreement.signatures.map((signature) => (
    <li key={signature.address.toString()}>
      <div className="m-2 flex items-center justify-between gap-20 rounded p-4 outline outline-dashed outline-1 outline-purple-200 hover:bg-purple-50">
        <section className="basis-2/5">
          <p className="font-semibold">{signature.identifier}</p>
          <p>{signature.signer?.toString() || "Waiting..."}</p>
          <Badge
            className="w-36"
            color={signature.used ? "bg-teal-500" : "bg-yellow-500"}
            text={signature.used ? "Signed" : "Unsigned"}
          />
        </section>
        <section className="">
          <Button
            text="Copy Link"
            onClick={() => {
              window.navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_HOST}/agreements/${agreement.address}/sign/${signature.index}`
              );
              toast.info("Link copied to clipboard");
            }}
            icon={
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
                  d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                />
              </svg>
            }
          />
        </section>
      </div>
    </li>
  ));
  return (
    <section>
      <div className="flex items-center gap-2">
        <h2 className="text-2xl">Agreement Details:</h2>
        <h3 className="text-xl font-bold"> {agreement.identifier}</h3>
        <Badge
          text={agreement.status}
          color={colorByStatus[agreement.status]}
        />
      </div>
      <div className="my-6">
        <div className="h-1.5 w-full rounded-full bg-slate-600">
          <div
            className="h-1.5 rounded-full bg-teal-500"
            style={{
              width: `${
                (agreement.signedPackets / agreement.totalPackets) * 100
              }%`,
            }}
          ></div>
        </div>
        <div className="my-2 text-center font-medium">
          {((agreement.signedPackets / agreement.totalPackets) * 100).toFixed(
            0
          )}
          % signed
        </div>
      </div>
      <ul>{signaturesDisplay}</ul>
    </section>
  );
}
