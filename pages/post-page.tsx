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
import Layout from "../components/Layout";
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
import dynamic from "next/dynamic";

const DynamicModelViewer = dynamic(() => import("../components/ModelViewer"), {
  ssr: false,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Postpage: NextPage<{ staticPosts: PROPS_POST[] }> = ({ staticPosts }) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const isLoadingPost = useSelector(selectIsLoadingAuth);
  const user = useSelector(selectProfile);
  const { data: posts, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/post_list/`,
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
    <Layout title="PostList">
      <div className="p-4 w-full max-w-2xl mx-auto">
        {posts &&
          posts.map((post: PROPS_POST) => (
            <div key={post.id}>
              <Post
                id={post.id}
                nickName={user.nickName}
                created_on={post.created_on}
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
              <div className="w-full">
                <DynamicModelViewer src={post.menu_item_model} />
              </div>
            </div>
          ))}
      </div>
    </Layout>
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
