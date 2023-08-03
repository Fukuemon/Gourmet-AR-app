/** useAuthCookies.ts
 * Cookieでアクセストークンを管理し、ユーザのログイン状態をチェックする処理をまとめたhooks
 * 使用箇所
 * - Navbar.tsx
 */

import Cookie from "universal-cookie";
import { AppDispatch } from "src/store/store";
import {
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  resetIsLogin,
  selectIsLogin,
  setIsLogin,
  setOpenSignIn,
  setOpenSignUp,
} from "../store/authSlice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { MouseEventHandler, useEffect } from "react";

export const useAuthCookies = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const isLogin = useSelector(selectIsLogin);
  const cookie = new Cookie();

  // ログイン状態をチェックし、ログインしていなければログイン画面を表示する関数
  // useEffectを用いて、ページが表示されたときにログイン状態をチェックする
  useEffect(() => {
    const fetchBootLoader = async () => {
      if (cookie.get("access_token")) {
        //jwtトークンがあるかどうか
        dispatch(setIsLogin); //ある場合：isLoginのstateを更新
        const result = await dispatch(fetchAsyncGetMyProf()); //ログインしてるユーザーのプロフィール情報を取得
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          //切れてる場合
          dispatch(resetIsLogin); //ログイン状態をリセット
          dispatch(setOpenSignIn()); //ログイン画面を開く
          router.push("/"); //ログイン画面に遷移{後ほどモーダル表示に修正}
          return null;
        }
        await dispatch(fetchAsyncGetProfs());
      }
    };
    fetchBootLoader();
  }, [dispatch, cookie, router]);

  // Cookieからアクセストークンを削除する関数
  const removeCookie = (key: string) => {
    cookie.remove(key, { path: "/" });
  };

  //ログアウト処理
  const logout: MouseEventHandler<HTMLAnchorElement> = async (event) => {
    removeCookie("access_token");
    router.push("/");
    dispatch(setOpenSignIn());
    dispatch(resetIsLogin());
  };

  return { logout };
};
