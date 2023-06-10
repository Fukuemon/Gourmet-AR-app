import type { NextPage } from "next";
import Auth from "../components/Auth";
import Layout from "../components/Layout";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <Layout showHeader={false} showFooter={false}>
      <Auth />
    </Layout>
  );
};

export default Home;
