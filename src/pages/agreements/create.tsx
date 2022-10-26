import type { NextPage } from "next";
import CreateAgreement from "../../components/agreements/CreateAgreement";
import SidebarLayout from "../../components/layouts/SidebarLayout";

const CreateAgreementPage: NextPage = () => {
  return (
    <SidebarLayout>
      <CreateAgreement />
    </SidebarLayout>
  );
};

export default CreateAgreementPage;
