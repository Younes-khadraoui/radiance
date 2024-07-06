import { ChevronDown, FilePlus2, Send } from "lucide-react";
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import io from "socket.io-client";
import { useUser } from "../UserProvider";
import userImage from "@/assets/user.webp";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const socket = io(BACKEND_URL);

interface IMessage {
  message: string;
  username: string;
  timestamp: string;
  profilePic: string;
}

const Home = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const { user } = useUser();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authToken") !== null;
    setAuthenticated(isAuthenticated);

    socket.on("initMessages", (initMessages) => {
      const formattedMessages = initMessages.map((msg: IMessage) => ({
        ...msg,
        timestamp: new Date(msg.timestamp).toLocaleString(),
      }));
      setMessages(formattedMessages.reverse());
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...message,
          timestamp: new Date(message.timestamp).toLocaleString(),
        },
      ]);
    });

    return () => {
      socket.off("initMessages");
      socket.off("message");
    };
  }, [authenticated, messages]);

  const sendMessage = () => {
    if (authenticated && input.trim()) {
      const messageData = {
        message: input,
        username: user.username,
        profilePic: user.profilePic || "",
        timestamp: new Date().toISOString(),
        email: user.email,
      };
      socket.emit("message", messageData);
      setInput("");
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleJoinGroup = () => {
    console.log("Join Group");
  };

  const handleCreateGroup = () => {
    console.log("Create Group");
  };

  return (
    <div className="flex h-screen p-20 justify-between gap-10">
      <div className="bg-white w-full rounded-2xl bg-opacity-10 relative pt-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className="px-4 pt-2 text-white flex gap-3 items-center"
          >
            <div>
              <img
                className="w-8 h-8 rounded-full inline-block"
                src={message.profilePic || userImage}
                alt="profile"
              />
            </div>
            <div>
              <div>
                <span
                  className={`font-bold ${
                    message.username === user.username ? "text-yellow-400" : ""
                  }`}
                >
                  {message.username}
                </span>{" "}
                : <span className="text-sm">{message.timestamp}</span>
              </div>
              <div> {message.message}</div>
            </div>
          </div>
        ))}
        <div className="absolute w-full bottom-0 p-4">
          <div className="bg-white  flex justify-center items-center px-4 rounded-2xl">
            <FilePlus2 className="opacity-60 hover:opacity-100 cursor-pointer" />
            <input
              className="outline-none w-full p-2 pl-4 "
              placeholder={
                authenticated
                  ? "W's in the chaaat"
                  : "You have to login mah boy"
              }
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              value={input}
              disabled={!authenticated}
            />
            <Send
              className="opacity-60 hover:opacity-100 cursor-pointer"
              onClick={sendMessage}
            />
          </div>
        </div>
      </div>
      <div className="bg-white w-96 rounded-2xl bg-opacity-10">
        <div className="flex justify-center items-center">
          <p className="text-white text-xl text-center p-2 font-medium">
            Global Group
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none cursor-pointer">
              <ChevronDown color="white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleCreateGroup}
              >
                Create Group
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleJoinGroup}
              >
                Join Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Home;
