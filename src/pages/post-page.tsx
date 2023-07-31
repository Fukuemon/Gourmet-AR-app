import { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AppDispatch } from "src/store/store";
import { useSelector, useDispatch } from "react-redux";
import Post from "src/features/Post/components/PostList";
import useSWR from "swr";
import { PROPS_POST } from "src/store/types";
import Layout from "src/components/Layout";
import {
  getPosts,
  fetchAsyncGetRestaurant,
  fetchAsyncGetCategory,
} from "src/store/post/postSlice";
import { resetOpenSignIn, selectProfile } from "src/store/auth/authSlice";
import Cookie from "universal-cookie";

const cookie = new Cookie(); //cookieの設定

// URLからデータを取得してJSONとして返すfetcher関数
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Postpage: NextPage<{ Posts: PROPS_POST[] }> = ({ Posts }) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectProfile);
  // useSWR：データのフェッチとキャッシュを行う

  const { data: posts, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/post_list/`, //指定されたURLから投稿のリストを取得
    fetcher,
    {
      fallbackData: Posts, //fallbackDataとして、静的な投稿データを設定
    }
  );
  useEffect(() => {
    // アクセストークンが存在する場合、サインイン状態をリセットし、レストランとカテゴリの情報を取得
    const fetchGetPost = async () => {
      if (cookie.get("access_token")) {
        dispatch(resetOpenSignIn());
        await dispatch(fetchAsyncGetRestaurant()); //レストランの情報を取得(未実装)
        await dispatch(fetchAsyncGetCategory()); //カテゴリの情報を取得(未実装)
      } else {
        // アクセストークンが存在しない場合、ホームページにリダイレクト
        router.push("/");
      }
    };
    fetchGetPost();
    mutate(); //データの再フェッチを実行
  }, [dispatch]);

  // データがまだロードされていない場合、ローディング表示
  if (router.isFallback || !posts) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <Layout title="PostList">
      <div className="p-4 w-full max-w-2xl mx-auto">
        {posts &&
          posts.map((post: PROPS_POST) => (
            <div key={post.id}>
              <Post
                id={post.id}
                nickName={user.nickName}
                created_on={post.created_on}
                loginId={user.id}
                author={post.author}
                restaurant={post.restaurant}
                category={post.category}
                menu_item={post.menu_item}
                menu_item_photo={post.menu_item_photo}
                menu_item_model={post.menu_item_model}
                review_text={post.review_text}
                score={post.score}
                price={post.price}
              />
            </div>
          ))}
      </div>
    </Layout>
  );
};

//SSR使用
export async function getServerSideProps() {
  const Posts = await getPosts();

  return {
    props: { Posts },
    // revalidate: 10, // 10秒ごとに再生成
  };
}

export default Postpage;
