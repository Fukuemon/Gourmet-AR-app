// ReactとNext.jsのライブラリをインポート
import { useState, FC } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import FileUpload from "src/components/elements/Form/FileUpload";
const DynamicModelViewer = dynamic(() => import("src/components/ModelViewer"), {
  ssr: false,
});

const Intro: FC = () => {
  // デフォルトの3Dモデルのファイルパスを設定
  const [modelSrc, setModelSrc] = useState("/4ステーキコンボ.glb");
  return (
    <>
      <Head>
        <title>AR Model Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center items-center flex-col w-screen">
        <div>
          <div className="text-2xl font-bold my-4">3Dモデル表示ページ</div>
        </div>

        <div className="container max-w-screen-lg mx-auto h-full sm:h-full border border-purple-100 rounded-lg mt-4 mb-4">
          <DynamicModelViewer src={modelSrc} />
        </div>

        <div>
          <div className="m-5 text-1xl font-bold">
            モデルをアップロードしたい場合
          </div>
          <FileUpload onUpload={setModelSrc} />
        </div>

        <div>
          <h1 className="m-5 text-1xl font-bold mb-2">3Dスキャンについて</h1>
        </div>
      </main>
    </>
  );
};

export default Intro;
