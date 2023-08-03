import { useSelector } from "react-redux";
import { selectProfile } from "src/features/auth/store/authSlice";
import Post from "src/features/Post/components/PostList";
import Layout from "src/components/layouts/Layout";
import { PROPS_POST } from "types/stores/types";
import { usePosts } from "src/features/Post/hooks/usePost";
import { getPosts } from "src/features/Post/store/postSlice";
import { NextPage } from "next";

const Postpage = ({ Posts }: { Posts: PROPS_POST[] }) => {
  const user = useSelector(selectProfile); // ログインユーザーの情報を取得
  const { posts, loading } = usePosts(Posts); //カスタムフック：投稿一覧を取得
  // データがまだロードされていない場合、ローディング表示
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <Layout title="PostList">
      <div className="relative z-0 p-4 w-full max-w-2xl mx-auto">
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
            </div>
          ))}
      </div>
    </Layout>
  );
};

//SSR使用
export async function getServerSideProps() {
  const Posts = await getPosts();

  return {
    props: { Posts },
    // revalidate: 10, // 10秒ごとに再生成
  };
}

export default Postpage;
