import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="Profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
        />
        <input
          id="username"
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <button type="button" className="text-red-700">
          Delete Account
        </button>
        <button type="button" className="text-red-700">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
