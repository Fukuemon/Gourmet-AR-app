import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { AppDispatch } from "src/store/store";
import useSWR from "swr";
import {
  fetchAsyncGetRestaurant,
  fetchAsyncGetCategory,
} from "src/features/Post/store/postSlice";
import { resetOpenSignIn } from "src/features/auth/store/authSlice";
import Cookie from "universal-cookie";
import { PROPS_POST } from "src/types/stores/types";

const cookie = new Cookie();

// URLからデータを取得してJSONとして返すfetcher関数
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const usePosts = (Posts: PROPS_POST[]) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const { data: posts, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/post_list/`,
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
        await dispatch(fetchAsyncGetRestaurant());
        await dispatch(fetchAsyncGetCategory());
      } else {
        // アクセストークンが存在しない場合、ホームページにリダイレクト
        router.push("/");
      }
    };
    fetchGetPost();
    mutate(); //データの再フェッチを実行
  }, [dispatch]);

  return { posts, loading: router.isFallback || !posts };
};
