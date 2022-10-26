import type { NextPage } from "next";
import { useEffect, useState } from "react";
import SidebarLayout from "../../components/layouts/SidebarLayout";
import { getSignatures, SignaturePacket } from "../../services/solana";
import SignatureList from "../../components/signatures/SignatureList";

const SignaturesPage: NextPage = () => {
  const [signatures, setSignatures] = useState<SignaturePacket[]>([]);

  useEffect(() => {
    (async () => {
      setSignatures(await getSignatures());
    })();
  }, []);

  return (
    <SidebarLayout>
      <h2 className="mb-2 text-2xl">Signatures</h2>
      <SignatureList signatures={signatures} />
    </SidebarLayout>
  );
};

export default SignaturesPage;
