// Redux Toolkitと必要な関数や型をインポート
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store/store"; //
import {
  PROPS_AUTHEN,
  PROPS_NICKNAME,
  PROPS_PROFILE,
} from "src/types/stores/types"; // 必要なプロパティの型をインポート
import Cookie from "universal-cookie";
import {
  createNewProfile,
  createNewUser,
  getJWTToken,
  getMyProfile,
  getProfiles,
  updateProfile,
} from "src/features/auth/store/aush"; // 非同期処理を定義した関数をインポート

const cookie = new Cookie();

// 非同期処理でJWTトークンを取得するための関数を定義
export const fetchAsyncLogin = createAsyncThunk(
  "auth/post", // アクションのタイプを定義します
  async (authen: PROPS_AUTHEN) => {
    // authenを引数に取るペイロードクリエーター関数を定義
    const res = await getJWTToken(authen); // JWTトークンを取得する関数を実行
    return res.data; // リクエストの結果を返す
  }
);

// 新規ユーザー登録を行うための非同期処理を定義
export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: PROPS_AUTHEN) => {
    const res = await createNewUser(auth); // 新規ユーザーを作成する関数を実行
    return res.data; // 登録結果を返
  }
);

// プロフィールを新規作成するための非同期処理を定義
export const fetchAsyncCreateProf = createAsyncThunk(
  "profile/post",
  async (nickName: PROPS_NICKNAME) => {
    const res = await createNewProfile(nickName); // プロフィールを新規作成する関数を実行
    return res.data; // プロフィール作成結果を返
  }
);

// プロフィールを編集するための非同期処理を定義
export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/put",
  async (profile: PROPS_PROFILE) => {
    const res = await updateProfile(profile); // プロフィールを更新する関数を実行
    return res.data; // プロフィール更新結果を返
  }
);

// ログインしているユーザー自身のプロフィールを取得するための非同期処理を定義
export const fetchAsyncGetMyProf = createAsyncThunk(
  "profile/getMyProf",
  async () => {
    const res = await getMyProfile(); // プロフィールを取得する関数を実行
    return res.data[0]; // プロフィールデータを返
  }
);

// プロフィール一覧を取得するための非同期処理を定義
export const fetchAsyncGetProfs = createAsyncThunk(
  "profile/getProfs",
  async () => {
    const res = await getProfiles(); // プロフィール一覧を取得する関数を実行
    return res.data; // プロフィールデータを返
  }
);

// authのsliceを作成
export const authSlice = createSlice({
  name: "auth", // sliceの名前を定義
  initialState: {
    // 初期状態を設定
    isLogin: false, // ログイン状態
    openSignin: true, // ログイン画面の表示状態
    openSignUp: false, // 新規登録画面の表示状態
    openProfile: false, // プロフィール画面の表示状態
    isLoadingAuth: false, // 認証のロード状態
    myprofile: {
      id: 0,
      nickName: "",
      userProfile: 0,
      created_on: "",
      img: "",
    },
    profiles: [
      {
        id: 0,
        nickName: "",
        userProfile: 0,
        created_on: "",
        img: "",
      },
    ],
  },
  reducers: {
    // 各種reducerを定義
    fetchCredStart(state) {
      state.isLoadingAuth = true; // 認証のロード状態をtrueに
    },
    fetchCredEnd(state) {
      state.isLoadingAuth = false; // 認証のロード状態をfalseに
    },
    setOpenSignIn(state) {
      state.openSignin = true; // ログイン画面を表示
    },
    resetOpenSignIn(state) {
      state.openSignin = false; // ログイン画面を非表示に
    },
    setOpenSignUp(state) {
      state.openSignUp = true; // 新規登録画面を表示
    },
    resetOpenSignUp(state) {
      state.openSignUp = false; // 新規登録画面を非表示に
    },
    setIsLogin(state) {
      state.isLogin = true; // ログイン状態に
    },
    resetIsLogin(state) {
      state.isLogin = false; // ログイン状態を解除
    },
    setOpenProfile(state) {
      state.openProfile = true; // プロフィール画面を表示
    },
    resetOpenProfile(state) {
      state.openProfile = false; // プロフィール画面を非表示に
    },
    editNickName(state, action) {
      state.myprofile.nickName = action.payload; // ニックネームを更新
    },
  },

  // 非同期処理の結果を元にstateを更新するextraReducerを定義
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      const options = { path: "/" };
      cookie.set("access_token", action.payload.access, options); // JWTをcookieに保存
    });
    builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload; // プロフィールを更新
    });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.myprofile = action.payload; // プロフィールを更新
    });
    builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
      state.profiles = action.payload; // プロフィール一覧を更新
    });
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload; // プロフィールを更新
      state.profiles = state.profiles.map((prof) =>
        prof.id === action.payload.id ? action.payload : prof
      ); // プロフィール一覧の該当のプロフィールを更新
    });
  },
});

// action creatorをエクスポート
export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenSignIn,
  resetOpenSignIn,
  setIsLogin,
  resetIsLogin,
  setOpenSignUp,
  resetOpenSignUp,
  setOpenProfile,
  resetOpenProfile,
  editNickName,
} = authSlice.actions;

// 各stateの値を取得するためのセレクター関数を定義
export const selectIsLoadingAuth = (state: RootState) =>
  state.auth.isLoadingAuth;
export const selectIsLogin = (state: RootState) => state.auth.isLogin;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;

// reducerをデフォルトでエクスポート
export default authSlice.reducer;
