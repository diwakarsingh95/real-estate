import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const fileInputRef = useRef();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleFileInputClick = () => {
    setFileUploadError(false);
    setFileUploadSuccess(false);
    setFileUploadPercentage(0);
    fileInputRef && fileInputRef.current.click();
  };

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
        (error) => {
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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          hidden
          onChange={(e) => setFile(e.target.files[0])}
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
