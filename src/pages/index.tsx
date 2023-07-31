import type { NextPage } from "next";
import Auth from "src/features/auth/Auth";
import Layout from "src/components/Layout";

const Home: NextPage = () => {
  return (
    <Layout showHeader={false} showFooter={false}>
      <Auth />
    </Layout>
  );
};

export default Home;
