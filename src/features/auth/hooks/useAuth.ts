/**useAuth
 * Auth.tsxで使用するカスタムフック
 * ログイン・新規登録処理を行うためのカスタムフック
 * ログインと新規登録のモードを切り替える関数
 * ログインの処理を行う関数
 * ゲストログインの処理を行う関数
 */

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchAsyncCreateProf,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  selectIsLoadingAuth,
  selectIsLogin,
  setIsLogin,
} from "src/features/auth/store/authSlice";
import { AppDispatch } from "src/store/store";
import { FormikErrors } from "formik";
import { PROPS_AUTHEN } from "types/stores/types";

export const useAuth = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const isLogin = useSelector(selectIsLogin); // ログイン状態を取得
  const isLoadingAuth = useSelector(selectIsLoadingAuth); // ログイン処理中かどうかを取得
  const GUEST_EMAIL = "user2@gmail.com";
  const GUEST_PASSWORD = "YOSIKAWA";
  const [switchKey, setSwitchKey] = useState(true); // ログイン・新規登録モードを切り替えるためのstate

  // switchMode：ログイン・新規登録モードを切り替える関数
  const switchMode = () => {
    setSwitchKey(!switchKey);
  };

  // commonAsyncProcess：ログイン・新規登録の共通処理を行う関数
  const commonAsyncProcess = async (values: PROPS_AUTHEN) => {
    await dispatch(fetchCredStart());
    await dispatch(fetchAsyncLogin(values));
    if (
      fetchAsyncLogin.rejected.match(await dispatch(fetchAsyncLogin(values)))
    ) {
      alert("認証に失敗しました。");
      dispatch(fetchCredEnd());
      return; // 認証に失敗したら、処理を終了
    }
    await dispatch(fetchAsyncGetMyProf());
    router.push("/post-page");
    await dispatch(fetchCredEnd());
  };

  // handleGuestLogin：ゲストログインの処理を行う関数
  // ゲストログインの処理は、ログイン処理と同じなので、
  // ログイン処理を行う関数を呼び出す
  const handleGuestLogin =
    (setErrors: (errors: FormikErrors<PROPS_AUTHEN>) => void) => () => {
      setErrors({}); // エラーをリセット
      commonAsyncProcess({ email: GUEST_EMAIL, password: GUEST_PASSWORD }); // ログイン処理を呼び出す
    };

  // 通常のログイン・新規登録処理
  const handleSubmit = async (values: { email: string; password: string }) => {
    if (switchKey) {
      commonAsyncProcess(values);
      await dispatch(setIsLogin());
    } else {
      // 新規登録処理
      await dispatch(fetchCredStart());
      const resultReg = await dispatch(fetchAsyncRegister(values));
      if (fetchAsyncRegister.fulfilled.match(resultReg)) {
        await dispatch(fetchAsyncLogin(values));
        await dispatch(fetchAsyncCreateProf({ nickName: "anonymous" }));
        await dispatch(fetchAsyncGetProfs());
        await dispatch(fetchAsyncGetMyProf());
        router.push("/post-page");
      }
      await dispatch(fetchCredEnd());
    }
  };

  return {
    switchMode,
    handleSubmit,
    handleGuestLogin,
    switchKey,
  };
};
