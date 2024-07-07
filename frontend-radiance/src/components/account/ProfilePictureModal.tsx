import React from "react";
import user0 from "@/assets/user0.png";
import users1 from "@/assets/user1.png";
import users2 from "@/assets/user2.png";
import users3 from "@/assets/user3.png";
import users4 from "@/assets/user4.png";
import users5 from "@/assets/user5.png";
import { Button } from "../ui/button";

interface ProfilePictureModalProps {
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  onSelect,
  onClose,
}) => {
  const profilePictures = [user0, users1, users2, users3, users4, users5];

  const handleSelect = (imageUrl: string) => {
    onSelect(imageUrl);
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg absolute z-50">
      <h2 className="text-lg font-bold mb-4">Choose Profile Picture</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {profilePictures.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Profile picture ${index}`}
            className="cursor-pointer rounded-lg h-56 w-64"
            onClick={() => handleSelect(img)}
          />
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
