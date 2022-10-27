import nacl from "tweetnacl";

export const downloadAndDecrypt = async ({
  cid,
  encryptionPWBytes,
}: {
  cid: string;
  encryptionPWBytes: Uint8Array;
}) => {
  const res = await fetch(`https://w3s.link/ipfs/${cid}`);
  if (!res.ok) {
    throw new Error("Could not fetch agreement from IPFS");
  }

  const pdf = nacl.secretbox.open(
    new Uint8Array(await res.arrayBuffer()),
    new Uint8Array(24),
    encryptionPWBytes.slice(0, 32)
  );

  if (!pdf) throw new Error("Agreement decryption failed");

  return pdf;
};

export const encryptAgreementAndPin = async ({
  pdf,
  name,
  encryptionPWBytes,
}: {
  pdf: Uint8Array;
  name: string;
  encryptionPWBytes: Uint8Array;
}): Promise<{ cid: string }> => {
  const encrypted = nacl.secretbox(
    pdf,
    new Uint8Array(24),
    encryptionPWBytes.slice(0, 32)
  );

  const fd = new FormData();
  fd.append("pdf", new Blob([encrypted]), name);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    throw new Error("Unable to pin agreement to IPFS");
  }

  return res.json();
};
