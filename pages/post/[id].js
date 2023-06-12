import { useEffect } from "react";
import { PROPS_POST } from "../../store/types";
import { getPostDetail, getPostIds } from "../../store/post/postSlice";
import { NextPage } from "next";
import { GetStaticPropsContext } from "next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import PostDetail from "../../components/PostDetail";
import useSWR from "swr";
import {
  resetOpenSignIn,
  selectIsLoadingAuth,
  selectProfile,
} from "../../store/auth/authSlice.ts";

const fetcher = (url) => fetch(url).then((res) => res.json());

const DetailPost = ({ staticPost, id }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectProfile);

  const { data: post, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}api/post_detail/${id}/`,
    fetcher,
    {
      fallbackData: staticPost,
    }
  );
  useEffect(() => {
    const fetchGetPost = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
      } else {
        router.push("/");
      }
    };
    fetchGetPost();
    mutate();
  }, [dispatch]);

  if (router.isFallback || !post) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <>
      <div className="p-4 w-full max-w-2xl mx-auto">
        {post && (
          <PostDetail
            key={post.id}
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
        )}
      </div>
    </>
  );
};

export async function getStaticPaths() {
  const paths = await getPostIds();
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const staticPost = await getPostDetail(params.id);
  return {
    props: {
      id: staticPost.id,
      staticPost,
    },
    revalidate: 1,
  };
}

export default DetailPost;
