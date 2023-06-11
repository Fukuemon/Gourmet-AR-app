// Redux Toolkitと必要な関数や型をインポート
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store' // ストアのルートステートをインポートします
import axios from 'axios'; // 非同期リクエストのためのaxiosをインポートします
import { PROPS_NEWPOST, PROPS_RESTAURANT, PROPS_CATEGORY  } from '../types'; // 必要なプロパティの型をインポート

const apiUrlPost = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/post/`;
const apiUrlRestaurant = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/restaurant/`;
const apiUrlCategory = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/category/`;

/*非同期関数*/
//投稿の一覧を取得
export const fetchAsyncGetPosts = createAsyncThunk("post/get", async () => {
    const res = await axios.get(apiUrlPost, {
        headers: {
            Authorization: `JWT ${localStorage.localJWT}`,
        },
    });
    return res.data; //投稿の配列を取得する
    //その後で、extrareducerで配列のデータを下のpostsの中のstateに格納する
});

//新規投稿作成
export const fetchAsyncNewPost = createAsyncThunk(
    "post/post",
    async (newPost: PROPS_NEWPOST) => {
        const uploadData = new FormData(); //データを格納
        uploadData.append("menu_item", newPost.menu_item);
        uploadData.append("restaurant", String(newPost.restaurant));
        uploadData.append("category", String(newPost.category));
        uploadData.append("score", String(newPost.score)); // 数値を文字列に変換
        uploadData.append("price", String(newPost.price)); // 数値を文字列に変換
        uploadData.append("review_text", newPost.review_text);
        uploadData.append("review_text", newPost.review_text);
        //　画像とモデルのファイルがある場合のみ、追加する
        newPost.menu_item_photo && uploadData.append("menu_item_photo", newPost.menu_item_photo, newPost.menu_item_photo.name);
        newPost.menu_item_model && uploadData.append("menu_item_model", newPost.menu_item_model, newPost.menu_item_model.name);
        const res = await axios.post(apiUrlPost, uploadData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`,
            }
        });
        return res.data;
    }
);

//レストランの一覧を取得
export const fetchAsyncGeRestaurant = createAsyncThunk("restaurant/get", async () => {
    const res = await axios.get(apiUrlRestaurant, {
        headers: {
            Authorization: `JWT ${localStorage.localJWT}`,
        },
    });
    return res.data; //レストランの配列を取得する
    //その後で、extrareducerで配列のデータを下のpostsの中のstateに格納する
});

// 新規レストラン作成
export const fetchAsyncNewRestaurant = createAsyncThunk(
    "restaurant/post",
    async (restaurant: PROPS_RESTAURANT) => {
        const res = await axios.post(apiUrlRestaurant, restaurant, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);


//カテゴリの一覧を取得
export const fetchAsyncGetCategory = createAsyncThunk("category/get", async () => {
    const res = await axios.get(apiUrlCategory, {
        headers: {
            Authorization: `JWT ${localStorage.localJWT}`,
        },
    });
    return res.data; //レストランの配列を取得する
    //その後で、extrareducerで配列のデータを下のpostsの中のstateに格納する
});


// 新規カテゴリ作成
export const fetchAsyncNewCategory = createAsyncThunk(
    "category/post",
    async (category: PROPS_CATEGORY) => {
        const res = await axios.post(apiUrlCategory, category, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);



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
    fetchPostStart(state) {
        state.isLoadingPost = true;
    },
    fetchPostEnd(state) {
        state.isLoadingPost = false;
    },
    setOpenPost(state) {
        state.openNewPost = true;
    },
    resetOpenPost(state) {
        state.openNewPost = false;
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