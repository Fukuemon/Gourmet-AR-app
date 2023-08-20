import Head from "next/head";
import Link from "next/link";
import { FC, ReactNode } from "react";
import Navbar from "src/components/layouts/Header/Navbar";
import { ButtomNavBar } from "./BottomNavbar/BottomNavBar";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Main: FC<{ children: ReactNode }> = ({ children }) => (
  <main className="flex justify-center items-center flex-col w-screen mb-20">
    {children}
  </main>
);

const Footer: FC = () => (
  <footer
    className={"w-full h-6 flex justify-center items-center border-t"}
  ></footer>
);

const Layout: FC<LayoutProps> = ({
  children,
  title = "グルグラ by Nextjs",
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <div>
      <Head>
        <link rel="icon" href="/icon.ico" />
        <title>{title}</title>
      </Head>
      {showHeader && <Navbar title={title} />}
      <Main>
        {children}
        <ButtomNavBar />
      </Main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
