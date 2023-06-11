export interface File extends Blob{
    readonly lastModified: number;
    readonly name: string;
}

/*authSlice.tsx*/
export interface PROPS_AUTHEN {
    email: string;
    password: string;
}

export interface PROPS_PROFILE {
    id: number;
    nickName: string;
    img: File | null;
}

export interface PROPS_NICKNAME {
    nickName: string;
}

/*postSlice.ts */
export interface PROPS_NEWPOST {
    restaurant: number; // restaurantのid
    category: number[]; // multiple category ids
    menu_item: string;
    menu_item_photo: File | null;
    menu_item_model: File | null;
    review_text: string;
    score: number;
    price: number;
}


export interface PROPS_RESTAURANT {
    name: string;
    location: string;
    posts: number[]; // associated post ids
}


export interface PROPS_CATEGORY {
    name: string;
    posts: number[] // associated post ids
}

/*Post.tsx ポストコンポーネントで使用する型*/
export interface PROPS_POST {
    postId: number; //投稿のid
    loginId: number; //ログインしているユーザーのid
    author: number; //投稿をしたユーザーのid
    restaurant: string; //レストランのid
    category: string; //カテゴリのid
    menu_item: string
    imageUrl: string;
    modelUrl: string;

}