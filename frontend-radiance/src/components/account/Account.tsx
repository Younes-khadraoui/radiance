import users from "../../assets/user.webp";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserProvider";

const Account = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser({ email: "", profilePic: "", admin: false, username: "Anonymous" });
    navigate("/");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="bg-white  p-8 rounded shadow-lg  bg-opacity-30 w-96">
        <h1 className="text-2xl font-bold mb-4 text-white ">Account</h1>
        <p className="mb-4 text-white">
          <span className="font-bold pr-4 ">Email:</span>
          {user.email || "who are you ?"}
        </p>
        <div className="mb-4">
          <img
            src={user.profilePic || users}
            alt="Profile"
            className="rounded-full"
            style={{ width: "150px", height: "150px" }}
          />
        </div>
        <p className="text-sm text-gray-300 ">Some additional text</p>
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
