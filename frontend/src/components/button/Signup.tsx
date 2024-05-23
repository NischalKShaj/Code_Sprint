// file to create the button for the sign-up

import Link from "next/link";

const Signup = () => {
  return (
    <div>
      <Link href="/signup">
        <button className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl absolute right-56 mr-3 mt-16">
          Signup
        </button>
      </Link>
    </div>
  );
};

export default Signup;
