// ReactとNext.jsのライブラリをインポート
import { useState, FC } from "react";
import Head from "next/head";

// カスタムコンポーネントをインポート
import Layout from "src/components/Layout";
import FileUpload from "src/components/FileUpload";
import { NextPage } from "next";
import Intro from "src/features/Intro/components/Intro";

const ARview: NextPage = () => {
  return (
    <Layout title="AR紹介ページ">
      <Intro />
    </Layout>
  );
};

export default ARview;
