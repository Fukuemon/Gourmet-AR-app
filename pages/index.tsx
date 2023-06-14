import type { NextPage } from "next";
import Auth from "../components/Auth";
import Layout from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout showHeader={false} showFooter={false}>
      <Auth />
    </Layout>
  );
};

export default Home;
