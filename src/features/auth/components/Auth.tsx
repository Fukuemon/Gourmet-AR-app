import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "src/features/Auth/hooks/useAuth";
import LoadingSpinner from "src/components/elements/Spinner/LoadingSpinner";
import FormField from "src/components/elements/Form/FormField";
import Button from "src/components/elements/Button/Button";
import { useSelector } from "react-redux";
import {
  selectIsLoadingAuth,
  selectIsLogin,
} from "src/features/Auth/store/authSlice";

export const Auth: React.FC = () => {
  const { switchMode, handleSubmit, handleGuestLogin, switchKey } = useAuth();
  const isLoadingAuth = useSelector(selectIsLoadingAuth);

  return (
    <Formik
      initialErrors={{ email: "required" }}
      initialValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("正しい形式で入力してください")
          .required("emailの入力は必須です"),
        password: Yup.string()
          .required("パスワードの入力は必須です")
          .min(4, "4桁以上で入力してください"),
      })}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        setErrors,
      }) => (
        <div className="flex justify-center items-center flex-col w-screen min-h-screen bg-amber-50">
          <div className="flex flex-col justify-center items-center p-8 w-96 bg-white rounded-lg shadow-2xl">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-2xl text-gray-800 font-bold m-4">
                {switchKey ? "ログイン" : "新規登録"}
              </h2>
              {isLoadingAuth && <LoadingSpinner />}
              <div className="flex itmes-center justify-center">
                <div className="text-sm">
                  <span
                    onClick={switchMode}
                    className="cursor-pointer font-medium text-indigo-500 hover:text-indigo-600"
                  >
                    {switchKey
                      ? "アカウントを作っていない場合はこちら"
                      : "ログインはこちら"}
                  </span>
                </div>
              </div>
            </div>

            <form className="p-8" onSubmit={handleSubmit}>
              <FormField
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Emailを入力"
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              <FormField
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="パスワードを入力"
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              <div>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-yellow-500 hover:bg-orange-400 text-white font-bold py-2 px-4 my-2 rounded focus:outline-none focus:shadow-outline"
                >
                  {switchKey ? "ログイン" : "新規登録"}
                </Button>

                <Button
                  type="button"
                  onClick={handleGuestLogin(setErrors)}
                  className="w-full  bg-slate-400 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  ゲストとしてログイン
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Formik>
  );
};
