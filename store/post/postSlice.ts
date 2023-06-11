// Redux Toolkitと必要な関数や型をインポート
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store' // ストアのルートステートをインポートします
import axios from 'axios'; // 非同期リクエストのためのaxiosをインポートします
import { PROPS_NEWPOST, PROPS_RESTAURANT, PROPS_CATEGORY  } from '../types'; // 必要なプロパティの型をインポート

const apiUrlPost = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/post/`;
const apiUrlRestaurant = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/restaurant/`;
const apiUrlCategory = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/category/`;


// authのsliceを作成
export const postSlice = createSlice({
  name: 'post', // sliceの名前を定義
  initialState: { // 初期状態を設定
    isLoadingPost: false, // 投稿中のローディング状態を管理
    openNewPost: false, //投稿画面の状態を管理
    posts: [
        {
            id: 0,
            author: 0,
            created_on: "",
            restaurant: 0,
            catygory: [],
            menu_item: "",
            menu_item_photo: null,
            menu_item_model: null,
            score: 0,
            price: 0,
            review_text: ""
        },
    ],
    restaurant: [
        {
            id: 0,
            name: "",
            location: "",
            post: []
        },
    ],
    category: [
        {
            id: 0,
            name: "",
            post:[],
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