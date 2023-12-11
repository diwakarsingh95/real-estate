import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
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

const Profile = () => {
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(false);

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleFileInputClick = () => {
    setFileUploadError(false);
    setFileUploadSuccess(false);
    setFileUploadPercentage(0);
    fileInputRef && fileInputRef.current.click();
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleFileUpload = (file) => {
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
          });
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserUpdateSuccess(false);

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        return dispatch(updateUserFailure(data.message));
      }

      dispatch(updateUserSuccess(data));
      setUserUpdateSuccess(true);
    } catch (err) {
      console.error(err);
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        return dispatch(deleteUserFailure(data.message));
      }

      dispatch(deleteUserSuccess());
    } catch (err) {
      console.error(err);
      dispatch(deleteUserFailure(err.message));
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

      dispatch(deleteUserSuccess());
    } catch (err) {
      console.error(err);
      dispatch(signOutUserFailure(err.message));
    }
  };

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
            src={formData.avatar || currentUser.avatar}
            alt="Profile"
            className="rounded-full h-24 w-24 object-cover"
          />
        </button>
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (image size must be less than 2 mb).
            </span>
          ) : fileUploadPercentage > 0 && fileUploadPercentage < 100 ? (
            <span className="text-slate-700">
              Uploading {fileUploadPercentage}%
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
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95"
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {userUpdateSuccess ? "User updated successfully!" : ""}
      </p>

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
