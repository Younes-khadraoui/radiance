import { useNavigate } from "react-router-dom";
import user from "@/assets/user.webp";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-0 left-0 w-screen flex  items-center justify-between p-4">
      <a href="/">
        <div className="font-extrabold text-xl cursor-pointer text-white">
          Radiance
        </div>
      </a>
      <div className="bg-white rounded-full w-10 h-10 cursor-pointer">
        <img
          className="rounded-full w-full h-full object-cover font-semibold"
          src={user}
          alt="user image placeholder"
          onClick={() => {
            navigate("/account");
          }}
        />
      </div>
    </div>
  );
};

export default Header;
