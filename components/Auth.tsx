import React from "react";
import { AppDispatch } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
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
    fetchCredStart, //非同期関数
    fetchCredEnd,
    fetchAsyncLogin,
    fetchAsyncRegister,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
    fetchAsyncCreateProf,
  } from "../store/auth/authSlice";

const Auth: React.FC = () => {
    const openSignIn = useSelector(selectOpenSignIn);
    const openSignUp = useSelector(selectOpenSignUp);
    const isLoadingAuth = useSelector(selectIsLoadingAuth);
    const dispatch: AppDispatch = useDispatch();

    return(
        <>
        <Modal isOpen={openSignUp}
        onRequestClose={async () => {
            await dispatch(resetOpenSignUp());
        }}
        className="mx-auto mt-20 w-80 h-96 p-8 transform translate-y-1/4 border rounded-lg bg-white"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-start justify-center">
            <Formik
            initialErrors={{email: "required"}}
            initialValues={{email:"", password:""}}
            onSubmit={async (values) => {
                await dispatch(fetchCredStart());
                const resultReg = await dispatch(fetchAsyncRegister(values));

                if(fetchAsyncRegister.fulfilled.match(resultReg)) {
                    await dispatch(fetchAsyncLogin(values));
                    await dispatch(fetchAsyncCreateProf({ nickName: "anonymous"}));
                    await dispatch(fetchAsyncGetProfs());
                    await dispatch(fetchAsyncGetMyProf());
                }
                await dispatch(fetchCredEnd());
                await dispatch(resetOpenSignIn());
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email("email format is wrong")
                    .required("email is must"),
                password: Yup.string().required("password is must").min(4),
            })}
            >
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    errors,
                    touched,
                    isValid,
                }) => (
                <form onSubmit={handleSubmit}>
                    <div>
                        <h1 className="font-playball font-normal text-center text-2xl">グルグラム</h1>
                        {/* プログレスバー*/}
                        <div className="my-4 flex justify-center"> 
                            {isLoadingAuth && <div className="loader"></div>} 
                        </div>

                        {/* email入力フォーム */}
                        <input
                            placeholder="email"
                            type="input"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            className="border mb-4 p-2 w-full rounded"
                        />
                        {touched.email && errors.email ? (
                            <div className="text-purple-600 text-center my-2">{errors.email}</div>
                        ) : null}

                        {/* パスワード入力フォーム */}
                        <input
                          placeholder="password"
                          type="password"
                          name="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                          className="border mb-4 p-2 w-full rounded"
                        />
                        {touched.password && errors.password ? (
                          <div className="text-purple-600 text-center my-2">{errors.password}</div>
                        ) : null}


                        {/* サブミットボタン */}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded text-white ${!isValid && 'cursor-not-allowed"
                            disabled={!isValid}
                        >
                            新規登録
                        </button>
                        {/* ログインと作成の切り替えボタン */}
                        <span
                            className="text-blue-500 text-center cursor-pointer"
                            onClick={async () => {
                            await dispatch(setOpenSignIn());
                            await dispatch(resetOpenSignUp());
                            }}
                        >
                            すでにアカウントをお持ちですか ?
                        </span>
                    </div>
                </form>
                )}
            </Formik>
        </Modal>

        <Modal
        isOpen={openSignIn}
        onRequestClose={async () => {
            await dispatch(resetOpenSignIn());
        }}
        className="mx-auto mt-20 w-80 h-96 p-8 transform translate-y-1/4 border rounded-lg bg-white"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-start justify-center">
            <Formik
                initialErrors={{ email: "required" }}
                initialValues={{ email: "", password: ""}}
                onSubmit={async (values) => {
                await dispatch(fetchCredStart());
                const result = await dispatch(fetchAsyncLogin(values));
                if (fetchAsyncLogin.fulfilled.match(result)) {
                    await dispatch(fetchAsyncGetProfs());
                    // await dispatch(fetchAsyncGetPosts());
                    // await dispatch(fetchAsyncGetComments());
                    await dispatch(fetchAsyncGetMyProf());
                }
                await dispatch(fetchCredEnd());
                await dispatch(resetOpenSignIn());
                }}
                validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email("email format is wrong")
                    .required("email is must"),
                password: Yup.string().required("password is must").min(4),
                })}
            >
                {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
                isValid,
                }) => (
                <div>
                    <form onSubmit={handleSubmit}>
                    <div className="flex flex-col"> {/* .auth_signUp */}
                        <h1 className="font-playball font-normal text-center text-2xl">ググプラム</h1> {/* .auth_title */}
                        <br />
                        {/* プログレスバー*/}
                        <div className="my-4 flex justify-center"> 
                            {isLoadingAuth && <div className="loader"></div>} 
                        </div>
                        <br />

                        <input
                        placeholder="email"
                        type="input"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        />
                        {touched.email && errors.email ? (
                            <div className="text-purple-600 text-center my-2">{errors.email}</div>
                        ) : null}
                        <br />

                        <input
                        placeholder="password"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        />
                        {touched.password && errors.password ? (
                          <div className="text-purple-600 text-center my-2">{errors.password}</div>
                        ) : null}
                        <br />
                        <br />
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded text-white ${!isValid && 'cursor-not-allowed'}`}
                            disabled={!isValid}
                        >
                            ログイン
                        </button>
                        <br />
                        <br />
                        <span
                            className="text-blue-500 text-center cursor-pointer"
                            onClick={async () => {
                            await dispatch(setOpenSignIn());
                            await dispatch(resetOpenSignUp());
                            }}
                        >
                            アカウントをお持ちでない ?
                        </span>
                    </div>
                    </form>
                </div>
                )}
            </Formik>
        </Modal>
        </>
    )
}

export default Auth