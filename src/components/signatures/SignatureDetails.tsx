import {
  Agreement,
  SignaturePacket,
  signMessage,
} from "../../services/filecoin";
import { useState } from "react";
import { toast } from "react-toastify";
import { useIPFS } from "../../providers/IPFSProvider";
import Badge from "../common/Badge";
import { colorByStatus, statusTitle } from "../../utils/ui";
import Button from "../common/Button";
import { useCallback } from "react";
import { downloadAndDecrypt } from "../../utils/files";
import { useWalletAddress } from "../../providers/FilecoinProvider";
import { constants } from "ethers";

export default function SignatureDetails({
  agreement,
  signature,
}: {
  agreement: Agreement;
  signature: SignaturePacket;
}) {
  const ipfs = useIPFS();
  const address = useWalletAddress();
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
        cid: signature.encryptedCid,
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
            color={constraint.used ? "bg-teal-500" : "bg-yellow-500"}
            text={constraint.used ? "Signed" : "Unsigned"}
          />
        </section>
        <section className="">
          <Badge
            text={
              constraint.signer?.toLowerCase() === address ? "You" : "Other"
            }
            color={
              constraint.signer?.toLowerCase() === address
                ? "bg-fuchsia-500"
                : "bg-purple-500"
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
          text={statusTitle[agreement.status]}
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
