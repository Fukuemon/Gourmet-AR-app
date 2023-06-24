import { useState } from "react";
import { useRouter } from "next/router";
import { AppDispatch } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  selectIsLoadingAuth, //認証のローディング
  fetchCredStart, //ローディング処理の開始
  fetchCredEnd, // ローディングの終了
  fetchAsyncLogin, // JWTトークンを取得する非同期関数
  fetchAsyncRegister, //新規ユーザー作成
  fetchAsyncGetMyProf, //プロフィールを作成する
  fetchAsyncGetProfs, //プロフィールを取得する
  fetchAsyncCreateProf,
} from "../store/auth/authSlice";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // フォームがログインモードかどうかのステートを管理
  const router = useRouter(); //useRouterをインポート(ルーティングの機能)
  const isLoadingAuth = useSelector(selectIsLoadingAuth); // 認証ローディングが行われているかどうかのステートを取得
  const dispatch: AppDispatch = useDispatch(); //useDispatchを使い、アクションを発行できるdispatch関数を取得
  const GUEST_EMAIL = "user2@gmail.com";
  const GUEST_PASSWORD = "YOSIKAWA";

  return (
    <Formik
      initialErrors={{ email: "required" }} // 初期のエラー状態を設定。emailフィールドは初めから必須。
      initialValues={{ email: "", password: "" }} // フォームの初期値を設定。emailとpasswordは初めから空に
      // フォームが提出されたときに実行される関数を定義。
      onSubmit={async (values) => {
        await dispatch(fetchCredStart()); // ローディング状態のアクション
        let result;
        let resultReg;
        if (isLogin) {
          // ログインモードの場合
          result = await dispatch(fetchAsyncLogin(values)); // 入力(value)を引数としてログインアクションを発行
          await dispatch(fetchAsyncGetMyProf()); // 自分のプロフィールを取得するアクションを発行
          router.push("/post-page");
        } else {
          // 新規登録モードの場合
          // ユーザー登録が成功した場合、ログインを行い、プロフィールを作成し、プロフィール一覧と自身のプロフィールを取得。
          resultReg = await dispatch(fetchAsyncRegister(values)); // ユーザー登録アクション
          if (fetchAsyncRegister.fulfilled.match(resultReg)) {
            await dispatch(fetchAsyncLogin(values));
            await dispatch(fetchAsyncCreateProf({ nickName: "anonymous" })); // プロフィールを作成するアクション
            await dispatch(fetchAsyncGetProfs()); // 全てのプロフィールを取得するアクション
            await dispatch(fetchAsyncGetMyProf()); // 自分のプロフィールを取得するアクション
            router.push("/post-page");
          }
        }
        await dispatch(fetchCredEnd()); // ローディング状態を終了するアクション
      }}
      // フォームのバリデーションスキーマを設定。emailは必須で、正しいフォーマットであることが要求。passwordも必須で、最小文字数は4と設定。
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("email format is wrong")
          .required("emailを入力して下さい"),
        password: Yup.string().required("パスワードを入力して下さい").min(4),
      })}
    >
      {({
        handleSubmit, // フォームが提出された時に呼び出される関数
        handleChange, // フォーム内のinput要素の値が変更された時に呼び出される関数
        handleBlur, // フォームのフィールドがフォーカスを失った時に呼び出される関数
        values, // フォームの現在の値の状態オブジェクト
        errors, // フォームの現在のエラーメッセージの状態オブジェクト
        touched, // フォームの各フィールドが一度でも触れられたかの状態オブジェクト
        isValid, // フォームがバリデーションに合格しているかのブール値
      }) => (
        <div className="flex justify-center items-center flex-col w-screen min-h-screen shadow">
          <div className="w-64">
            <div className="rounded-md shadow-sm -space-y-px">
              <h1 className="mt-8 font-playball font-normal text-center text-2xl">
                {isLogin ? "ログイン" : "新規アカウント作成"}
              </h1>
            </div>
            {/* プログレスバー*/}
            <div className="flex justify-center items-center">
              {isLoadingAuth && (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="animate-spin h-8 w-8 text-gray-200 dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </div>
          </div>
          <form className="p-8" onSubmit={handleSubmit}>
            <div>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Emailを入力"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && touched.email && (
                <div className="text-center text-red-500">{errors.email}</div>
              )}
            </div>
            <br />
            <div>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワードを入力"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && touched.password && (
                <div className="text-center text-red-500">
                  {errors.password}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center">
              <div className="mt-4 mb-4 text-sm">
                <span
                  onClick={() => setIsLogin(!isLogin)}
                  className="cursor-pointer font-medium text-blue hover:text-indigo-500"
                >
                  {isLogin
                    ? "まだアカウントを作っていない場合はこちら"
                    : "ログインはこちら"}
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={!isValid}
              >
                {isLogin ? "ログイン" : "新規作成"}
              </button>
              <button
                onClick={async () => {
                  await dispatch(fetchCredStart());
                  await dispatch(
                    fetchAsyncLogin({
                      email: GUEST_EMAIL,
                      password: GUEST_PASSWORD,
                    })
                  );
                  await dispatch(fetchAsyncGetMyProf());
                  router.push("/post-page");
                  await dispatch(fetchCredEnd());
                }}
                className="flex w-full justify-center mt-4 rounded-md bg-gray-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                ゲストで参加
              </button>
            </div>
          </form>
        </div>
      )}
    </Formik>
  );
};

export default Auth;
