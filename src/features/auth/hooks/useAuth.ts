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
} from "src/features/auth/store/authSlice";
import { AppDispatch } from "src/store/store";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const dispatch: AppDispatch = useDispatch();
  const GUEST_EMAIL = "user2@gmail.com";
  const GUEST_PASSWORD = "YOSIKAWA";

  const switchMode = () => {
    setIsLogin(!isLogin);
  };

  const handleGuestLogin = async () => {
    await dispatch(fetchCredStart());
    await dispatch(
      fetchAsyncLogin({ email: GUEST_EMAIL, password: GUEST_PASSWORD })
    );
    await dispatch(fetchAsyncGetMyProf());
    router.push("/post-page");
    await dispatch(fetchCredEnd());
  };

  const handleSubmit = async (values: { email: string; password: string }) => {
    await dispatch(fetchCredStart());
    let result;
    let resultReg;
    if (isLogin) {
      result = await dispatch(fetchAsyncLogin(values));
      await dispatch(fetchAsyncGetMyProf());
      router.push("/post-page");
    } else {
      resultReg = await dispatch(fetchAsyncRegister(values));
      if (fetchAsyncRegister.fulfilled.match(resultReg)) {
        await dispatch(fetchAsyncLogin(values));
        await dispatch(fetchAsyncCreateProf({ nickName: "anonymous" }));
        await dispatch(fetchAsyncGetProfs());
        await dispatch(fetchAsyncGetMyProf());
        router.push("/post-page");
      }
    }
    await dispatch(fetchCredEnd());
  };

  return {
    isLogin,
    isLoadingAuth,
    switchMode,
    handleSubmit,
    handleGuestLogin,
  };
};
