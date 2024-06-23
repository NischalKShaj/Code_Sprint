// button for login

import Link from "next/link";

const Login = () => {
  return (
    <div>
      <Link href="/login">
        <button className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl absolute mr-3 mt-16 mx-[650px]">
          Login
        </button>
      </Link>
    </div>
  );
};

export default Login;
