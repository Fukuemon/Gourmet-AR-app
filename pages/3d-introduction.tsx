// ReactとNext.jsのライブラリをインポート
import { useState, FC } from "react";
import Head from "next/head";

// カスタムコンポーネントをインポート
import Layout from "../components/Layout";
import FileUpload from "../components/FileUpload";
import { NextPage } from "next";
import Intro from "../components/Intro";

const ARview: NextPage = () => {
  return (
    <Layout title="AR紹介ページ">
      <Intro />
    </Layout>
  );
};

export default ARview;
