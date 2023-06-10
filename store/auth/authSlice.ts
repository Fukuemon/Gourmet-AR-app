// Redux Toolkitと必要な関数や型をインポート
import { createSlice, createAsyncThunk, isAction } from '@reduxjs/toolkit';
import { RootState } from '../store' // ストアのルートステートをインポートします
import axios from 'axios'; // 非同期リクエストのためのaxiosをインポートします
import { PROPS_AUTHEN, PROPS_NICKNAME, PROPS_PROFILE } from '../types'; // 必要なプロパティの型をインポート

// 非同期処理でJWTトークンを取得するための関数を定義
export const fetchAsyncLogin = createAsyncThunk(
  "auth/post", // アクションのタイプを定義します
  async (authen: PROPS_AUTHEN) => { // authenを引数に取るペイロードクリエーター関数を定義
    const res = await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}authen/jwt/create`, authen, {
      headers: {
        "Content-Type": "application/json", // リクエストのContent-Typeを定義
      },
    });
    return res.data; // リクエストの結果を返す
  }
);

// 新規ユーザー登録を行うための非同期処理を定義
export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: PROPS_AUTHEN) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/register/`, auth, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data; // 登録結果を返
  }
)

// プロフィールを新規作成するための非同期処理を定義
export const fetchAsyncCreateProf = createAsyncThunk(
  "profile/post",
  async (nickName: PROPS_NICKNAME) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/profile/`, nickName, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`, // JWT認証が必要
      },
    });
    return res.data; // プロフィール作成結果を返
  }
)

// プロフィールを編集するための非同期処理を定義
export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/put",
  async (profile: PROPS_PROFILE) => {
    const uploadData = new FormData();
    uploadData.append("nickName", profile.nickName);
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/profile/${profile.id}/`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`, // JWT認証が必要
        },
      }
    );
    return res.data; // プロフィール編集結果を返
  }
)

// ログインしているユーザー自身のプロフィールを取得するための非同期処理を定義
export const fetchAsyncGetMyProf = createAsyncThunk("profile/getMyProf", async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/myprofile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`, // JWT認証が必要
    },
  });
  return res.data[0]; // 最初のプロフィールデータを返
});

// プロフィール一覧を取得するための非同期処理を定義
export const fetchAsyncGetProfs = createAsyncThunk("profile/getProfs", async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/profile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`, // JWT認証が必要
    },
  });
  return res.data; // プロフィールデータを返
});

// authのsliceを作成
export const authSlice = createSlice({
  name: 'auth', // sliceの名前を定義
  initialState: { // 初期状態を設定
    openSignIn: true,
    openSignUp: false,
    openProfile: false,
    isLoadingAuth: false,
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
  reducers: { // 各種reducerを定義
    fetchCredStart(state) {
      state.isLoadingAuth = true; // 認証のロード状態をtrueに
    },
    fetchCredEnd(state) {
      state.isLoadingAuth = false; // 認証のロード状態をfalseに
    },
    setOpenSignIn(state) {
      state.openSignIn = true; // ログイン画面を表示
    },
    resetOpenSignIn(state) {
      state.openSignIn = false; // ログイン画面を非表示に
    },
    setOpenSignUp(state) {
      state.openSignUp = true; // 登録画面を表示
    },
    resetOpenSignUp(state) {
      state.openSignUp = false; // 登録画面を非表示に
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
      localStorage.setItem("localJWT", action.payload.access); // JWTをlocalStorageに保存
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
      prof.id === action.payload.id ? action.payload : prof) // プロフィール一覧の該当のプロフィールを更新
    })

  },
});

// action creatorをエクスポート
export const {
  fetchCredStart, 
  fetchCredEnd, 
  setOpenSignIn, 
  resetOpenSignIn, 
  setOpenSignUp, 
  resetOpenSignUp, 
  setOpenProfile, 
  resetOpenProfile, 
  editNickName  
} = authSlice.actions;

// 各stateの値を取得するためのセレクター関数を定義
export const selectIsLoadingAuth = (state: RootState) => state.auth.isLoadingAuth;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;

// reducerをデフォルトでエクスポート
export default authSlice.reducer;
