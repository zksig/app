import { useState } from "react";
import { toast } from "react-toastify";
import { constants, ethers } from "ethers";
import { useIPFS } from "../../providers/IPFSProvider";
import Badge from "../common/Badge";
import { colorByStatus, statusTitle } from "../../utils/ui";
import Button from "../common/Button";
import { useCallback } from "react";
import { downloadAndDecrypt } from "../../utils/files";
import { Agreement, signMessage } from "../../services/digitalSignatures";

export default function AgreementDetails({
  agreement,
}: {
  agreement: Agreement;
}) {
  const ipfs = useIPFS();
  const [pdfUrl, setPdfUrl] = useState("");
  const [encryptionPWBytes, setEncryptionPWBytes] = useState<Uint8Array>();

  const getEncyptionPWBytes = useCallback(async () => {
    if (!signMessage) throw new Error("Wallet not connected");

    const encryptionPWBytes = await signMessage(
      `Encrypt PDF for ${agreement.identifier}`
    );
    setEncryptionPWBytes(encryptionPWBytes);

    return encryptionPWBytes;
  }, [signMessage, agreement]);

  const handleDecryptPdf = useCallback(async () => {
    try {
      if (!ipfs) throw new Error("IPFS not ready");

      const pdf = await downloadAndDecrypt({
        encryptionPWBytes: encryptionPWBytes || (await getEncyptionPWBytes()),
        cid: agreement.encryptedCid,
      });

      setPdfUrl(
        `data:application/pdf;base64,${Buffer.from(pdf!).toString("base64")}`
      );
    } catch (e: any) {
      toast.error(`Unable to decrypt agreement: ${e.message}`);
    }
  }, [ipfs, agreement, getEncyptionPWBytes]);

  const signaturesDisplay = agreement.constraints.map((constraint) => (
    <li key={constraint.identifier}>
      <div className="m-2 flex items-center justify-between gap-20 rounded p-4 outline outline-dashed outline-1 outline-purple-200 hover:bg-purple-50">
        <section className="basis-2/5">
          <p className="font-semibold">{constraint.identifier}</p>
          <p>
            {constraint.signer === constants.AddressZero
              ? "Waiting..."
              : constraint.signer}
          </p>
          <Badge
            className="w-36"
            color={
              constraint.allowedToUse.eq(constraint.totalUsed)
                ? "bg-teal-500"
                : "bg-yellow-500"
            }
            text={
              constraint.allowedToUse.eq(constraint.totalUsed)
                ? "Signed"
                : "Unsigned"
            }
          />
        </section>
        <section className="">
          {encryptionPWBytes ? (
            <Button
              text="Copy Link"
              color="bg-teal-500"
              hoverColor="bg-teal-400"
              onClick={async () => {
                const pw = encodeURIComponent(
                  Buffer.from(encryptionPWBytes!).toString("base64")
                );
                await window.navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_HOST}/agreements/${agreement.owner}/${agreement.index}/sign/${constraint.identifier}?pw=${pw}`
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
          ) : (
            <Button
              text="Create Link"
              onClick={getEncyptionPWBytes}
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
          )}
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
          text={statusTitle[agreement.status]}
          color={colorByStatus[agreement.status]}
        />
        {agreement.nftContractAddress !== ethers.constants.AddressZero ? (
          <Badge className="w-12" color="bg-fuchsia-500" text="NFT" />
        ) : null}
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
      <Button
        text="Decrypt Agreement"
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        }
        onClick={handleDecryptPdf}
      />
      <iframe className="h-screen w-full" src={pdfUrl} />
    </section>
  );
}
