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
export const fetchAsyncGetRestaurant = createAsyncThunk("restaurant/get", async () => {
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
    restaurants: [
        {
            id: 0,
            name: "",
            location: "",
            post: []
        },
    ],
    categories: [
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
    setOpenNewPost(state) {
        state.openNewPost = true;
    },
    resetOpenNewPost(state) {
        state.openNewPost = false;
    },
  },

  // 非同期処理の結果を元にstateを更新するextraReducerを定義
  extraReducers: (builder) => {
    //新規投稿一覧の取得が成功した場合
    builder.addCase(fetchAsyncGetPosts.fulfilled, (state, action) => {
        return {
            ...state,
            posts: action.payload //それらをpostsのstateに格納する
        };
    });

    //新規投稿の作成が成功した場合
    builder.addCase(fetchAsyncNewPost.fulfilled, (state, action) => {
        return {
            ...state,
            //既存の投稿リストを展開して、その一番最後の要素に新規投稿の要素を足す
            posts: [...state.posts, action.payload] 
        };
    });
        // レストラン一覧の取得が成功した場合
        builder.addCase(fetchAsyncGetRestaurant.fulfilled, (state, action) => {
            return {
                ...state,
                restaurants: action.payload // レストランの配列をstateに格納する
            };
        });
    
        // 新規レストラン作成が成功した場合
        builder.addCase(fetchAsyncNewRestaurant.fulfilled, (state, action) => {
            return {
                ...state,
                // 既存のレストランリストに新規レストランを追加
                restaurants: [...state.restaurants, action.payload]
            };
        });
    
        // カテゴリ一覧の取得が成功した場合
        builder.addCase(fetchAsyncGetCategory.fulfilled, (state, action) => {
            return {
                ...state,
                categories: action.payload // カテゴリの配列をstateに格納する
            };
        });
    
        // 新規カテゴリ作成が成功した場合
        builder.addCase(fetchAsyncNewCategory.fulfilled, (state, action) => {
            return {
                ...state,
                // 既存のカテゴリリストに新規カテゴリを追加
                categories: [...state.categories, action.payload]
            };
        });
    },
});

// action creatorをエクスポート
export const {
    fetchPostStart,
    fetchPostEnd,
    setOpenNewPost,
    resetOpenNewPost,
} = postSlice.actions;

// 各stateの値を取得するためのセレクター関数を定義
export const selectIsLodingPost = (state: RootState) =>
    state.post.isLoadingPost;
export const selectOpenNewPost = (state: RootState) =>state.post.openNewPost;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectRestaurants = (state: RootState) => state.post.restaurants;
export const selectCategories = (state: RootState) => state.post.categories;

// reducerをデフォルトでエクスポート
export default postSlice.reducer;