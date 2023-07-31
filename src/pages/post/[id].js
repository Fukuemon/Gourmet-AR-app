import { useEffect } from "react";
import { PROPS_POST } from "../../../types/stores/types";
import { getPostDetail, getPostIds } from "../../features/Post/store/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import PostDetail from "src/features/Post/components/PostDetail";
import useSWR from "swr";
import { selectProfile } from "../../features/auth/store/authSlice";
import Cookie from "universal-cookie";

const cookie = new Cookie();
const fetcher = (url) => fetch(url).then((res) => res.json());

const DetailPost = ({ staticPost, id }) => {
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
      if (cookie.get("access_token")) {
      } else {
        router.push("/");
      }
    };
    fetchGetPost();
    mutate();
  }, []);

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
            nickName={post.author}
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
    revalidate: 60,
  };
}

export default DetailPost;
