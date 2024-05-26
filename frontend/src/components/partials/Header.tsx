// file for the header
import Link from "next/link";
import Image from "next/image";
import Login from "../button/Login";
import Signup from "../button/Signup";
import { AppState } from "@/app/store";
import Logout from "../button/Logout";

const Header = () => {
  const { isAuthorized, user } = AppState();
  return (
    <>
      <header className="bg-[#F0E6E6] flex">
        <Link href="/">
          <Image
            src="/image/test-removebg-preview.png"
            width={250}
            height={250}
            alt="logo"
          />
        </Link>
        <div className="flex flex-row">
          <button className="button bg-gray-50 text-white font-bold py-2 px-4 rounded-3xl absolute left-64 mr-3  mt-16">
            <span>
              <svg
                viewBox="0 0 20 20"
                height="20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.145 18.29c-5.042 0-9.145-4.102-9.145-9.145s4.103-9.145 9.145-9.145 9.145 4.103 9.145 9.145-4.102 9.145-9.145 9.145zm0-15.167c-3.321 0-6.022 2.702-6.022 6.022s2.702 6.022 6.022 6.022 6.023-2.702 6.023-6.022-2.702-6.022-6.023-6.022zm9.263 12.443c-.817 1.176-1.852 2.188-3.046 2.981l5.452 5.453 3.014-3.013-5.42-5.421z"></path>
              </svg>
            </span>
          </button>
          <input
            type="text"
            id="search"
            placeholder="search anything..."
            className="p-4 bg-gray-50 border-gray-300 rounded-3xl w-[550px] h-10 pl-16 pr-3 mr-3 mt-16"
          />
        </div>
        <ul className="flex space-x-20 items-center justify-center text-lg mx-5">
          <li>
            <Link href="/course">Course</Link>
          </li>
          <li>
            <Link href="/contest">Contest</Link>
          </li>
          <li>
            <Link href="/problems">Problems</Link>
          </li>
          <li>
            <Link href="/discuss">Discuss</Link>
          </li>
        </ul>
        {isAuthorized ? (
          <div>
            <p>{user?.email}</p>
            <Logout />
          </div>
        ) : (
          <div>
            <Login />
            <Signup />
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
