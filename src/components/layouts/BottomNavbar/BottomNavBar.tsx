import Button from "src/components/elements/Button/Button";
import {
  CubeTransparentIcon,
  HomeIcon,
  MapIcon,
  PlusCircleIcon,
  UserIcon,
} from "src/components/elements/Icons/BottomiconPaths";

export const ButtomNavBar: React.FC = () => (
  <div className="fixed bottom-0 left-0 z-50 w-full h-20 bg-yellow-50 border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
    <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
      <Button
        type="button"
        className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
      >
        <HomeIcon />
        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
          Home
        </span>
      </Button>
      <Button
        type="button"
        className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
      >
        <MapIcon />
        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
          Map
        </span>
      </Button>

      <Button
        type="button"
        className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
      >
        <PlusCircleIcon />
        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
          NewPost
        </span>
      </Button>
      <Button
        type="button"
        className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
      >
        <CubeTransparentIcon />
        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
          Intro
        </span>
      </Button>
      <Button
        type="button"
        className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
      >
        <UserIcon />
        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
          Profile
        </span>
      </Button>
    </div>
  </div>
);
