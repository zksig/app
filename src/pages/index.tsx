import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import type { NextPage } from "next";
import SidebarLayout from "../components/layouts/SidebarLayout";

const Home: NextPage = () => {
  return (
    <SidebarLayout>
      <h1>Home</h1>
    </SidebarLayout>
  );
};

export default withPageAuthRequired(Home);
