import useNavigate from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center px-4 mt-24 sm:px-5 lg:px-8">
      <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-center">
        Take a first step towards{" "}
        <span className="text-red-500">positive change</span>
      </h1>
      <p className="mt-6 sm:mt-8 text-gray-700 text-center text-sm sm:text-base md:text-lg sm:w-[430px] w-full max-w-md">
        Start your journey to a more organized and fulfilling life with our
        powerful habit tracker. Stay motivated and on track!
      </p>
      <button
        onClick={() => navigate("/register")}
        className="bg-red-500 mt-8 py-2 px-6 sm:px-8 rounded-md text-white font-semibold text-sm sm:text-base"
      >
        Let's get started
      </button>
    </div>
  );
}

export default Landing;
