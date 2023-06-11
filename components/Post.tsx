import Image from "next/image";
import Link from "next/link";
import { PROPS_POST } from "../store/types";

const Post: React.FC<PROPS_POST> = ({
  //propsとして投稿のデータを受け取る
  id,
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
        <div className="text-gray-700 mt-2">{review_text}</div>
        <div className="mt-3">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {"¥" + price}
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {"Score: " + score}
          </span>
        </div>
        <div className="flex items-center mt-2">
          <Link href={`/post/${id}`}>
            <a className="text-indigo-500 hover:text-indigo-600 text-sm">
              詳細を見る
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Post;
