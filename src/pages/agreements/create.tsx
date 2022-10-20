import { withPageAuthRequired } from "@auth0/nextjs-auth0";
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

export default withPageAuthRequired(CreateAgreementPage);
