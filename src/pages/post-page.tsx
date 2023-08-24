import { NextPage } from "next";
import { useSelector } from "react-redux";
import { selectProfile } from "src/features/Auth/store/authSlice";
import { usePosts } from "src/features/Post/hooks/usePost";
import { getPosts } from "src/features/Post/store/postSlice";
import PostList from "src/features/Post/components/PostList";
import Layout from "src/components/layouts/Layout";
import { PROPS_POST } from "src/types/Post/types";

const Postpage: NextPage<{ Posts: PROPS_POST[] }> = ({ Posts }) => {
  const user = useSelector(selectProfile);
  const { posts, loading } = usePosts(Posts);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <Layout title="PostList">
      <div className="relative z-0 p-4 w-full max-w-2xl mx-auto">
        {posts?.map(
          ({
            id,
            created_on,
            author,
            restaurant,
            category,
            menu_item,
            menu_item_photo,
            menu_item_model,
            review_text,
            score,
            price,
          }: PROPS_POST) => (
            <div key={id}>
              <PostList
                id={id}
                nickName={user.nickName}
                created_on={created_on}
                loginId={user.id}
                author={author}
                restaurant={restaurant}
                category={category}
                menu_item={menu_item}
                menu_item_photo={menu_item_photo}
                menu_item_model={menu_item_model}
                review_text={review_text}
                score={score}
                price={price}
              />
            </div>
          )
        )}
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  const Posts = await getPosts();

  return {
    props: { Posts },
  };
}

export default Postpage;
