import { useState } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserProvider";
import ProfilePictureModal from "./ProfilePictureModal";
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE_PICTURE } from "@/graphql/mutations";
import userImage from "@/assets/user.png";
import { Pen } from "lucide-react";
import useSocketStore from "@/stores/socketStore";

const Account = () => {
  const { socket } = useSocketStore();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [updateProfilePicture] = useMutation(UPDATE_PROFILE_PICTURE);

  const handleUpdateProfilePicture = async (newProfilePicUrl: string) => {
    try {
      const { data } = await updateProfilePicture({
        variables: { profilePic: newProfilePicUrl },
      });

      setUser((prevUser) => ({
        ...prevUser,
        profilePic: data.updateProfilePicture.profilePic,
      }));

      console.log("Updated profile picture:", data.updateProfilePicture);
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser({
      email: "",
      profilePic: "",
      admin: false,
      username: "",
      joinedGroups: ["Global Group"],
      online: false,
    });
    localStorage.removeItem("currentGroup");
    socket?.emit("userDisconnect");
    navigate("/");
  };

  const handleSelectProfilePic = (imageUrl: string) => {
    handleUpdateProfilePicture(imageUrl);
    setShowModal(false);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {showModal && (
        <ProfilePictureModal
          onSelect={handleSelectProfilePic}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="bg-white p-8 rounded shadow-lg bg-opacity-30 w-96">
        <h1 className="text-2xl font-bold mb-4 text-white">Account</h1>
        <p className="mb-4 text-white">
          <span className="font-bold pr-4">Email:</span>
          {user.email || "who are you ?"}
        </p>
        <div className="mb-4 cursor-pointer" onClick={() => setShowModal(true)}>
          <div className="relative">
            <img
              src={user.profilePic || userImage}
              alt="Profile"
              className="rounded-full"
              style={{ width: "150px", height: "150px" }}
            />
            <Pen size={24} className="text-white absolute top-4 left-28" />
          </div>
        </div>
        <p className="text-sm text-gray-300">Some additional text</p>
        <div className="flex gap-4 pt-10">
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Account;
