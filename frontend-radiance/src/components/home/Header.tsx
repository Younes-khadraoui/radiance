import { useNavigate } from "react-router-dom";
import { useUser } from "../UserProvider";
import userImage from "@/assets/user.png";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="absolute top-0 left-0 w-screen flex items-center justify-between p-4">
      <a href="/">
        <div className="font-extrabold text-xl cursor-pointer text-white">
          Radiance
        </div>
      </a>
      <div className="bg-white rounded-full w-10 h-10 cursor-pointer">
        <img
          className="rounded-full w-full h-full object-cover"
          src={user.profilePic || userImage}
          alt="User Profile"
          onClick={() => {
            navigate("/account");
          }}
        />
      </div>
    </div>
  );
};

export default Header;
