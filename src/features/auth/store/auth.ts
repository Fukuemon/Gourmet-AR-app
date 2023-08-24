import { get } from "http";
/**authSliceで使用するデータ関数を定義
 * JWTトークンを取得する関数
 * 新規ユーザーを作成する関数
 * プロフィールを作成する関数
 * プロフィールを取得する関数
 * プロフィールを更新する関数
 * ログインユーザーのプロフィールを取得する関数
 * プロフィール一覧を取得する関数
 */

import axios from "axios";
import {
  PROPS_AUTHEN,
  PROPS_NICKNAME,
  PROPS_PROFILE,
} from "src/types/Auth/types";
import Cookie from "universal-cookie";

const cookie = new Cookie();
//JWTトークンを取得する関数
export const getJWTToken = (authen: PROPS_AUTHEN) => {
  const res = axios.post(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}authen/jwt/create`,
    authen,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

//新規ユーザーを作成する関数
export const createNewUser = (auth: PROPS_AUTHEN) => {
  const res = axios.post(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/register/`,
    auth,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

//プロフィールを新規作成する関数
export const createNewProfile = (nickName: PROPS_NICKNAME) => {
  const res = axios.post(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/profile/`,
    nickName,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${cookie.get("access_token")}`, // JWT認証が必要
      },
    }
  );
  return res;
};

//プロフィールを新規作成する関数
export const getProfile = (id: number) => {
  const res = axios.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/profile/${id}/`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

//プロフィールを更新する関数
export const updateProfile = (profile: PROPS_PROFILE) => {
  const uploadData = new FormData();
  uploadData.append("nickName", profile.nickName);
  profile.img && uploadData.append("img", profile.img, profile.img.name);

  const res = axios.put(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/profile/${profile.id}/`,
    uploadData,
    {
      headers: {
        "Content-Type": "application/json",
        Autherization: `JWT ${cookie.get("access_token")}`,
      },
    }
  );
  return res;
};

//ログインユーザーのプロフィールを取得する関数
export const getMyProfile = () => {
  const res = axios.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/myprofile/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${cookie.get("access_token")}`, // JWT認証が必要
      },
    }
  );
  return res;
};

//プロフィール一覧を取得する関数
export const getProfiles = () => {
  const res = axios.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/profile/`, {
    headers: {
      Authorization: `JWT ${cookie.get("access_token")}`, // JWT認証が必要
    },
  });
  return res;
};
