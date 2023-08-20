import Image from "next/image";
import { PROPS_POST } from "src/types/stores/types";
import dynamic from "next/dynamic";

const DynamicModelViewer = dynamic(() => import("src/components/ModelViewer"), {
  ssr: false,
});

const PostDetail: React.FC<PROPS_POST> = ({
  //propsとして投稿のデータを受け取る
  nickName,
  id,
  created_on,
  loginId,
  author,
  restaurant,
  category,
  menu_item,
  menu_item_photo,
  menu_item_model,
  review_text,
  score,
  price,
}) => {
  return (
    <div className="border rounded-md overflow-hidden shadow-md my-3">
      {menu_item_photo && (
        <Image
          src={menu_item_photo}
          alt={menu_item}
          width={500}
          height={300}
          layout="responsive"
          objectFit="cover"
        />
      )}
      <div className="p-4">
        <h2 className="font-bold text-lg">{menu_item}</h2>
        <span className="text-gray-700 mt-2">投稿日：{created_on}</span>
        <div className="mt-3">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {"¥" + price}
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {"Score: " + score}
          </span>
          <div className="">
            {/* 3Dモデルが存在する場合にModelViewerをレンダリングします */}
            {menu_item_model && (
              <>
                <p className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                  3Dモデル
                </p>
                <div className="border w-full">
                  <DynamicModelViewer src={menu_item_model} />
                </div>
              </>
            )}
          </div>
          <div className="border mt-4">
            <p className="font-bold text-lg pl-4">レビュー</p>
            <span className="pl-4">{review_text}</span>
          </div>
        </div>
        <div className="flex items-center mt-2"></div>
      </div>
    </div>
  );
};

export default PostDetail;
