/**Navbar.tsx
 * レイアウトコンポーネントのヘッダーのナビゲーションバー
 * ログインしているユーザーのプロフィール情報を表示
 * useAuthCookiesからログアウト処理とログイン状態のロジックを受け取る
 */
import { useSelector } from "react-redux";
import {
  selectIsLogin,
  selectProfile,
} from "src/features/auth/store/authSlice";
import { FC } from "react";
import { useAuthCookies } from "src/features/auth/hooks/useAuthCookies";
import Link from "next/link";

interface NavbarProps {
  title: string;
}

const Navbar: FC<NavbarProps> = ({ title }) => {
  const profile = useSelector(selectProfile);
  const isLogin = useSelector(selectIsLogin);
  const { logout } = useAuthCookies(); // ログアウト処理を受け取る
  return (
    <div className="navbar bg-yellow-50 border-b mb-4">
      <div className="navbar-start flex-1">
        <a className="btn btn-ghost normal-case text-xl">{title}</a>
      </div>
      {isLogin ? ( // ログインしている場合はプロフィール画像を表示
        <>
          <div className="navbar-center">
            <a className="btn btn-ghost normal-case text-xl">
              {profile.nickName}
            </a>
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="rounded-full">
                <img src={profile.img} alt="User Profile" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="absolute z-30 mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={logout}>Logout</a>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <Link href="/">
            <a className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white transition duration-200 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Login
            </a>
          </Link>
        </>
      )}
    </div>
  );
};

export default Navbar;
