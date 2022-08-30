const Banner = () => {
  return (
    <div className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0">
      <div className="px-10 space-y-5">
        <h1 className="text-6xl max-w-xl font-serif">
          <span className="underline decoration-black decoration-4">
            Medium
          </span>{" "}
          is a place to write, read and connect
        </h1>
        <h2>
          It's easy and free to post your thniking on any topic and connect with
          miiilions of readers
        </h2>
      </div>
      <img
        src={
          "https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
        }
        alt="medium-banner-image"
        className="hidden md:inline-flex h-32 lg:h-full"
      />
      <div></div>
    </div>
  );
};

export default Banner;
