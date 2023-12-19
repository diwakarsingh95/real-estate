import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import clsx from "clsx";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { listingsApi } from "../redux/api/apiSlice";
import { useAppDispatch, useAppSelector } from "../hooks";

const Profile = () => {
  const fileInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const dispatch = useAppDispatch();
  const { currentUser, loading, error } = useAppSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: currentUser?.username,
    email: currentUser?.email,
    password: "",
    avatar: currentUser?.avatar,
  });
  const [file, setFile] = useState<File | null>();
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(false);

  const handleFileUpload = useCallback(
    (file: File) => {
      try {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFileUploadPercentage(Math.round(progress));
          },
          () => {
            setFileUploadError(true);
          },
          () => {
            setFileUploadSuccess(true);
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
              setFormData({ ...formData, avatar: downloadUrl });
              setFile(null);
            });
          }
        );
      } catch (err) {
        console.error(err);
      }
    },
    [formData]
  );

  const handleFileInputClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) {
      return;
    }

    setFileUploadError(false);
    setFileUploadPercentage(0);
    setFileUploadSuccess(false);
    setFile(e.currentTarget.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUserUpdateSuccess(false);

    try {
      const { username, email, avatar, password } = formData;

      if (!username || !email) return;

      const updateData = {
        email,
        username,
      } as Partial<typeof formData>;

      if (password) updateData.password = password;
      if (avatar) updateData.avatar = avatar;

      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();

      if (data.success === false) {
        return dispatch(updateUserFailure(data.message));
      }

      dispatch(updateUserSuccess(data));
      setUserUpdateSuccess(true);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        dispatch(updateUserFailure(err.message));
      } else dispatch(updateUserFailure("Something went wrong."));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser?._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        return dispatch(deleteUserFailure(data.message));
      }

      dispatch(listingsApi.util.invalidateTags(["Listings"]));
      dispatch(deleteUserSuccess());
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        dispatch(deleteUserFailure(err.message));
      } else dispatch(deleteUserFailure("Something went wrong."));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        return dispatch(signOutUserFailure(data.message));
      }

      dispatch(listingsApi.util.invalidateTags(["Listings"]));
      dispatch(deleteUserSuccess());
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        dispatch(signOutUserFailure(err.message));
      } else dispatch(signOutUserFailure("Something went wrong."));
    }
  };

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file, handleFileUpload]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (userUpdateSuccess) {
      timeoutId = setTimeout(() => setUserUpdateSuccess(false), 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [userUpdateSuccess]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (fileUploadSuccess) {
      timeoutId = setTimeout(() => setFileUploadSuccess(false), 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [fileUploadSuccess]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="self-center"
          disabled={fileUploadPercentage > 0 && fileUploadPercentage < 100}
        >
          <img
            onClick={handleFileInputClick}
            src={formData.avatar || currentUser?.avatar}
            alt="Profile"
            className={clsx(
              "rounded-full h-24 w-24 object-cover",
              fileUploadPercentage > 0 &&
                fileUploadPercentage < 100 &&
                "opacity-75"
            )}
          />
        </button>
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (image size must be less than 2 mb).
            </span>
          ) : fileUploadPercentage > 0 && fileUploadPercentage < 100 ? (
            <span className="text-sky-600">
              Uploading... {fileUploadPercentage}%
            </span>
          ) : fileUploadSuccess ? (
            <span className="text-green-700">Image successfully uploaded.</span>
          ) : null}
        </p>
        <input
          id="username"
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.username}
          required
          onChange={handleChange}
          autoComplete="username"
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.email}
          required
          onChange={handleChange}
          autoComplete="email"
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        {error && <p className="text-red-700">{error}</p>}
        {userUpdateSuccess && (
          <p className="text-green-700">User updated successfully!</p>
        )}
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95"
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
        <Link
          to="/listings"
          className="block bg-cyan-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Show Listings
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <button
          type="button"
          className="text-red-700"
          onClick={handleDeleteUser}
        >
          Delete Account
        </button>
        <button type="button" className="text-red-700" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
