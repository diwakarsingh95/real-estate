import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../../services/types";

type ListingContactFormProps = {
  listingName: string;
  owner: User
};

const ListingContactForm = ({
  listingName,
  owner
}: ListingContactFormProps) => {
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <p>
        Contact <span className="font-semibold">{owner.username}</span> for{" "}
        <span className="font-semibold">{listingName.toLowerCase()}</span>
      </p>
      <textarea
        name="message"
        id="message"
        rows={2}
        value={message}
        onChange={handleChange}
        placeholder="Enter your message here..."
        className="w-full border p-3 rounded-lg"
      ></textarea>

      <Link
        to={`mailto:${owner.email}?subject=Regarding ${listingName}&body=${message}`}
        className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
      >
        Send Message
      </Link>
    </div>
  );
};

export default ListingContactForm;
