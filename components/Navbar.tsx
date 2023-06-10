import { useDispatch, useSelector } from "react-redux";
import {
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  fetchCredEnd,
  fetchCredStart,
  resetOpenSignIn,
  selectProfile,
  setOpenSignIn,
} from "../store/auth/authSlice";
import { useRouter } from "next/router";
import { AppDispatch } from "../store/store";
import { FC, MouseEventHandler, useEffect } from "react";

interface NavbarProps {
  title: string;
}

const Navbar: FC<NavbarProps> = ({ title }) => {
  const router = useRouter();
  const profile = useSelector(selectProfile);
  const dispatch: AppDispatch = useDispatch();
  const logout: MouseEventHandler<HTMLAnchorElement> = async (event) => {
    event.preventDefault();
    dispatch(fetchCredStart());
    localStorage.removeItem("localJWT");
    router.push("/");
    dispatch(fetchCredEnd());
  };
  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
        await dispatch(fetchAsyncGetProfs());
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <div className="navbar bg-base-100 border-b m-4">
      <div className="navbar-start flex-1">
        <a className="btn btn-ghost normal-case text-xl">グルグラ</a>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost normal-case text-xl">{profile.nickName}</a>
      </div>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src={profile.img} alt="User Profile" />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <a className="justify-between">Profile</a>
          </li>
          <li>
            <a onClick={logout}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
