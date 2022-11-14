import type { Agreement, SignatureConstraint } from "../../services/filecoin";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useIPFS } from "../../providers/IPFSProvider";
import { downloadAndDecrypt } from "../../utils/files";
import Badge from "../common/Badge";
import Button from "../common/Button";

export default function Sign({
  agreement,
  signature,
  encryptionPW,
  onSign,
}: {
  agreement: Agreement;
  signature: SignatureConstraint;
  encryptionPW: string;
  onSign: () => void;
}) {
  const ipfs = useIPFS();
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    if (!encryptionPW) return;
    (async () => {
      try {
        if (!ipfs) throw new Error("IPFS not ready");

        const pdf = await downloadAndDecrypt({
          cid: agreement.encryptedCid,
          encryptionPWBytes: new Uint8Array(
            Buffer.from(encryptionPW, "base64")
          ),
        });

        setPdfUrl(
          `data:application/pdf;base64,${Buffer.from(pdf!).toString("base64")}`
        );
      } catch (e: any) {
        console.log(e);
        toast.error(`Unable to decrypt agreement: ${e.message}`);
      }
    })();
  }, [ipfs, encryptionPW, agreement]);

  return (
    <section>
      <div className="flex items-center gap-2">
        <h2 className="text-2xl">Sign:</h2>
        <h3 className="text-xl font-bold">{signature.identifier}</h3>
        <Badge
          color={signature.used ? "bg-teal-500" : "bg-yellow-500"}
          text={signature.used ? "Signed" : "Unsigned"}
        />
      </div>
      <div className="flex justify-end">
        {!signature.used ? (
          <Button
            text="Sign"
            onClick={() => onSign()}
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            }
          />
        ) : null}
      </div>
      <iframe className="h-screen w-full" src={pdfUrl} />
    </section>
  );
}
