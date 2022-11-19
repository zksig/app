import type { NextPage } from "next";
import { useEffect, useState } from "react";
import SignatureList from "../../components/signatures/SignatureList";
import {
  SignaturePacket,
  getSignatures,
} from "../../services/digitalSignature";

const SignaturesPage: NextPage = () => {
  const [signatures, setSignatures] = useState<SignaturePacket[]>([]);

  useEffect(() => {
    (async () => {
      setSignatures(await getSignatures());
    })();
  }, []);

  return (
    <>
      <h2 className="mb-2 text-2xl">Signatures</h2>
      <SignatureList signatures={signatures} />
    </>
  );
};

export default SignaturesPage;
