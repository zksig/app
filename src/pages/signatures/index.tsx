import type { NextPage } from "next";
import SignatureList from "../../components/signatures/SignatureList";
import { useSignatures } from "../../services/digitalSignatures";

const SignaturesPage: NextPage = () => {
  const { signatures } = useSignatures();

  return (
    <>
      <h2 className="mb-2 text-2xl">Signatures</h2>
      <SignatureList signatures={signatures} />
    </>
  );
};

export default SignaturesPage;
