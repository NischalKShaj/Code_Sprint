// page for user and tutor signup

const Signup = () => {
  return (
    <div className="flex flex-col items-center mb-24 bg-white mt-16">
      <h3 className="text-2xl font-bold mb-6 text-center items-center">
        Learn with Passion. Connect with Experts.
        <br /> Sign up today!
      </h3>
      <section className="bg-[#D9D9D9] p-8 h-[530px] w-[370px] rounded-lg shadow-md">
        <form action="">
          <input
            type="text"
            placeholder="username"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
          />
          <input
            type="text"
            placeholder="email"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
          />
          <div className="border border-gray-300 bg-gray-50 rounded-lg p-4 w-full mt-3">
            <div className="flex items-center mb-4">
              <input type="radio" id="student" name="role" value="student" />
              <label htmlFor="student">Student</label>
            </div>
            <div className="flex items-center mb-4">
              <input type="radio" id="tutor" name="role" value="tutor" />
              <label htmlFor="tutor">Tutor</label>
            </div>
          </div>
          <input
            type="text"
            placeholder="phone"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
          />
          <input
            type="password"
            placeholder="password"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
          />
          <button className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl w-full mt-7">
            signup
          </button>
        </form>
      </section>
    </div>
  );
};

export default Signup;
