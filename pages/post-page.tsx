import { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AppDispatch } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import Post from "../components/Post";
import useSWR from "swr";
import { PROPS_POST } from "../store/types";
import {
  getPosts,
  selectPosts,
  selectIsLoadingPost,
  setOpenNewPost,
  resetOpenNewPost,
  fetchAsyncGetPosts,
  fetchAsyncGetRestaurant,
  fetchAsyncGetCategory,
} from "../store/post/postSlice";
import {
  resetOpenSignIn,
  selectIsLoadingAuth,
  selectProfile,
} from "../store/auth/authSlice";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Postpage: NextPage<{ staticPosts: PROPS_POST[] }> = ({ staticPosts }) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const isLoadingPost = useSelector(selectIsLoadingAuth);
  const user = useSelector(selectProfile);
  const { data: posts, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/post/`,
    fetcher,
    {
      fallbackData: staticPosts,
    }
  );
  useEffect(() => {
    const fetchGetPost = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetPosts());
        await dispatch(fetchAsyncGetRestaurant());
      } else {
        router.push("/");
      }
    };
    fetchGetPost();
    mutate();
  }, [dispatch]);

  if (router.isFallback || !posts) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <>
      {posts &&
        posts.map((post: PROPS_POST) => (
          <Post
            key={post.id}
            id={post.id}
            loginId={user.id}
            author={post.author}
            restaurant={post.restaurant}
            category={post.category}
            menu_item={post.menu_item}
            menu_item_photo={post.menu_item_photo}
            menu_item_model={post.menu_item_model}
            review_text={post.review_text}
            score={post.score}
            price={post.price}
          />
        ))}
    </>
  );
};

export async function getStaticProps() {
  const staticPosts = await getPosts();

  return {
    props: { staticPosts },
    revalidate: 1,
  };
}

export default Postpage;