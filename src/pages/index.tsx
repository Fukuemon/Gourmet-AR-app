import type { NextPage } from "next";
import { Auth } from "src/features/Auth/components/Auth";
import Layout from "src/components/layouts/Layout";

const Home: NextPage = () => {
  return <Auth />;
};

export default Home;
