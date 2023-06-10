/*createSlice を使って認証官家のSliceを作っていく */
import { createSlice, createAsyncThunk, isAction } from '@reduxjs/toolkit';
import { RootState } from '../store'
import axios from 'axios';
import { PROPS_AUTHEN, PROPS_NICKNAME, PROPS_PROFILE } from '../types';



//emailとpasswordを元にJWTトークンを取得する非同期関数
export const fetchAsyncLogin = createAsyncThunk( 
  "auth/post", // アクションタイプ 
  async (authen: PROPS_AUTHEN) => { // ペイロードクリエーター関数 引数としてauthenを受け取る
    const res = await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}authen/jwt/create`, authen, { // axiosを用いた非同期リクエスト
      headers: {
        "Content-Type": "application/json", // リクエストのヘッダー
      },
    });
    return res.data; // 成功した場合、レスポンスのデータ部分がReduxのstoreに保存される
  }
);

/**emailとpassを元に新規ユーザー作成を行う関数
 * 新しく作るユーザーのemailとpassをreact側から受け取るようにする
*/
export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: PROPS_AUTHEN) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/register/`, auth, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
)

/**プロフィールを新規で作る関数*/
export const fetchAsyncCreateProf = createAsyncThunk(
  "profile/post",
  async (nickName: PROPS_NICKNAME) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/profile/`, nickName, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`, //この関数はjwtの認証を通らないといけない
      },
    });
    return res.data;
  }
)

/**プロフィールを編集する関数 */
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
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data
  }
)

/**ログインしてるユーザーの自身のプロフィールを取得する関数 */
export const fetchAsyncGetMyProf = createAsyncThunk("profile/getMyProf", async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/myprofile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data[0];
});

/**存在するプロフィールの一覧を取得 */
export const fetchAsyncGetProfs = createAsyncThunk("profile/getProfs", async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/profile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
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
  reducers: {
    fetchCredStart(state) {
      state.isLoadingAuth = true;
    },
    fetchCredEnd(state) {
      state.isLoadingAuth = false;
    },
    setOpenSignIn(state) {
      state.openSignIn = true;
    },
    resetOpenSignIn(state) {
      state.openSignIn = false;
    },
    setOpenSignUp(state) {
      state.openSignUp = true;
    },
    resetOpenSignUp(state) {
      state.openSignUp = false;
    },
    setOpenProfile(state) {
      state.openProfile = true;
    },
    resetOpenProfile(state) {
      state.openProfile = false;
    },
    editNickName(state, action) {
      state.myprofile.nickName = action.payload;
    },
  },

  //extra Reducer
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem("localJWT", action.payload.access);
    });
    builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
      state.profiles = state.profiles.map((prof) =>
      prof.id === action.payload.id ? action.payload : prof)
    })

  },
});

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

export const selectIsLoadingAuth = (state: RootState) =>
  state.auth.isLoadingAuth; //authはstoreのreducerの名前と一致させる

export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;


export default authSlice.reducer;