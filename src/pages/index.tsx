import type { NextPage } from "next";
import Auth from "src/features/auth/components/Auth";
import Layout from "src/components/layouts/Layout";
import { Auth2 } from "src/features/auth/components/Auth2";

const Home: NextPage = () => {
  return <Auth2 />;
};

export default Home;
