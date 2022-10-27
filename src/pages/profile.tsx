import type { GetServerSideProps, NextPage } from "next";
import SidebarLayout from "../components/layouts/SidebarLayout";

const Profile: NextPage = () => {
  return (
    <SidebarLayout>
      <h1>Profile</h1>
    </SidebarLayout>
  );
};

export default Profile;
