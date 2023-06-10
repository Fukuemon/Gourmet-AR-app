import { useState } from "react";
import { useRouter } from "next/router";
import { AppDispatch } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  selectIsLoadingAuth, //セレクター
  selectOpenSignIn,
  selectOpenSignUp,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  fetchCredStart, //ローディング処理の開始
  fetchCredEnd, // ローディングの終了
  fetchAsyncLogin, // JWTトークンを取得する非同期関数
  fetchAsyncRegister, //新規ユーザー作成
  fetchAsyncGetMyProf, //プロフィールを作成する
  fetchAsyncGetProfs, //プロフィールを取得する
  fetchAsyncCreateProf,
} from "../store/auth/authSlice";

const Auth2: React.FC = () => {
  const router = useRouter(); //useRouterをインポート(ルーティングの機能)
  const openSignIn = useSelector(selectOpenSignIn); // ログイン画面が開かれているかのステートを取得
  const openSignUp = useSelector(selectOpenSignUp); // サインアップ画面が開かれているかのステートを取得
  const isLoadingAuth = useSelector(selectIsLoadingAuth); // 認証ローディングが行われているかどうかのステートを取得
  const dispatch: AppDispatch = useDispatch(); //useDispatchを使い、アクションを発行できるdispatch関数を取得

  return (
    <Formik
      initialErrors={{ email: "required" }} // 初期のエラー状態を設定。emailフィールドは初めから必須。
      initialValues={{ email: "", password: "" }} // フォームの初期値を設定。emailとpasswordは初めから空に
      // フォームが提出されたときに実行される関数を定義。
      onSubmit={async (values) => {
        await dispatch(fetchCredStart()); // ローディング状態を開始。
        const resultReg = await dispatch(fetchAsyncRegister(values)); // ユーザーの登録を行う。結果はresultRegに格納
        // ユーザー登録が成功した場合、ログインを行い、プロフィールを作成し、プロフィール一覧と自身のプロフィールを取得。
        if (fetchAsyncRegister.fulfilled.match(resultReg)) {
          await dispatch(fetchAsyncLogin(values));
          await dispatch(fetchAsyncCreateProf({ nickName: "anonymous" }));
          await dispatch(fetchAsyncGetProfs());
          await dispatch(fetchAsyncGetMyProf());
        }
        await dispatch(fetchCredEnd()); // ローディング状態を終了
        await dispatch(resetOpenSignIn()); // ログイン画面を閉じる
      }}
      // フォームのバリデーションスキーマを設定。emailは必須で、正しいフォーマットであることが要求。passwordも必須で、最小文字数は4と設定。
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("email format is wrong")
          .required("email is must"),
        password: Yup.string().required("password is must").min(4),
      })}
    >
      {({
        handleSubmit, // フォームが提出された時に呼び出される関数です
        handleChange, // フォーム内のinput要素の値が変更された時に呼び出される関数です
        handleBlur, // フォームのフィールドがフォーカスを失った時に呼び出される関数です
        values, // フォームの現在の値の状態オブジェクトです
        errors, // フォームの現在のエラーメッセージの状態オブジェクトです
        touched, // フォームの各フィールドが一度でも触れられたかの状態オブジェクトです
        isValid, // フォームがバリデーションに合格しているかのブール値です
      }) => (
        <form onSubmit={handleSubmit}>
          {/*これらのプロパティを使ってカスタムフォームコンポーネントを記載する */}
        </form>
      )}
    </Formik>
  );
};

export default Auth2;
