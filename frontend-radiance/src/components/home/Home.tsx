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
import { useUser, User } from "../UserProvider";
import CreateGroup from "../groups/CreateGroup";
import JoinGroup from "../groups/JoinGroup";
import { useGroupStore } from "@/stores/groupStore";
import { useMutation, useQuery } from "@apollo/client";
import { JOIN_GROUP, QUIT_GROUP, GET_GROUP_MEMBERS } from "@/graphql/mutations";
import userImage from "@/assets/user.png";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const socket = io(BACKEND_URL);

interface IMessage {
  message: string;
  username: string;
  timestamp: string;
  profilePic: string;
  email: string;
  group: string;
}

const Home = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const {
    showCreateGroup,
    setShowCreateGroup,
    showJoinGroup,
    setShowJoinGroup,
    currentGroup,
    setCurrentGroup,
  } = useGroupStore();

  const { user } = useUser();

  const [joinGroup] = useMutation(JOIN_GROUP);
  const [quitGroup] = useMutation(QUIT_GROUP);

  const {
    data: groupMembersData,
    loading: groupMembersLoading,
    error: groupMembersError,
  } = useQuery(GET_GROUP_MEMBERS, {
    variables: { groupName: currentGroup },
    skip: !currentGroup,
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authToken") !== null;
    setAuthenticated(isAuthenticated);

    const savedGroup = localStorage.getItem("currentGroup");
    if (savedGroup && savedGroup !== currentGroup) {
      setCurrentGroup(savedGroup);
      socket.emit("joinGroup", savedGroup);
    }
    if (isAuthenticated) {
      socket.emit("userConnected", { username: user.username });
    }
  }, [currentGroup, setCurrentGroup, user.username]);

  useEffect(() => {
    socket.emit("joinGroup", currentGroup);
    socket.on("groupMessages", (groupMessages) => {
      const formattedMessages = groupMessages.map((msg: IMessage) => ({
        ...msg,
        timestamp: new Date(msg.timestamp).toLocaleString(),
      }));
      setMessages(formattedMessages);
    });
    socket.on("initMessages", (initMessages) => {
      console.log("initMessages", initMessages);
      if (initMessages.group === currentGroup) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...initMessages,
            timestamp: new Date(initMessages.timestamp).toLocaleString(),
            group: currentGroup,
          },
        ]);
      }
    });
    socket.on("message", (message) => {
      console.log("initMessages", message);
      if (message.group === currentGroup) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...message,
            timestamp: new Date(message.timestamp).toLocaleString(),
            group: currentGroup,
          },
        ]);
      }
    });
    return () => {
      socket.off("groupMessages");
      socket.off("initMessages");
      socket.off("message");
    };
  }, [currentGroup]);

  const sendMessage = () => {
    if (authenticated && input.trim()) {
      const messageData = {
        message: input,
        username: user.username,
        profilePic: user.profilePic || "",
        timestamp: new Date().toISOString(),
        email: user.email,
        group: currentGroup,
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

  const handleCreateGroup = (groupName: string) => {
    socket.emit("createGroup", groupName);
    setCurrentGroup(groupName);
    setShowCreateGroup(false);
    joinGroup({ variables: { groupName: groupName } });
    localStorage.setItem("currentGroup", groupName);
  };

  const handleJoinGroup = (groupName: string) => {
    socket.emit("joinGroup", groupName);
    setCurrentGroup(groupName);
    setShowJoinGroup(false);
    joinGroup({ variables: { groupName: groupName } });
    localStorage.setItem("currentGroup", groupName);
  };

  const handleQuitGroup = (groupName: string) => {
    socket.emit("quitGroup", groupName);
    setCurrentGroup("Global Group");
    quitGroup({ variables: { groupName: groupName } });
    localStorage.setItem("currentGroup", "Global Group");
  };

  const handleNavigateToGroup = (groupName: string) => {
    localStorage.setItem("currentGroup", groupName);
    setCurrentGroup(groupName);
    setShowJoinGroup(false);
  };

  const onlineMembers = groupMembersData?.getGroupMembers.filter(
    (member: User) => member.online
  );
  const offlineMembers = groupMembersData?.getGroupMembers.filter(
    (member: User) => !member.online
  );

  return (
    <div className="flex h-screen p-10 pt-20 lg:p-20 flex-col lg:flex-row lg:justify-between gap-10">
      <div className="bg-white w-full rounded-2xl bg-opacity-10 relative pt-2 order-2 lg:order-1 flex-1">
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
      <div className="bg-white  rounded-2xl bg-opacity-10 order-1 lg:order-2 w-full lg:w-96">
        <div className="flex justify-center items-center">
          <p className="text-white text-xl text-center p-2 font-semibold">
            {currentGroup || "Global Group"}
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
                onClick={() => setShowCreateGroup(true)}
              >
                Create Group
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setShowJoinGroup(true)}
              >
                Join Group
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Joined Groups</DropdownMenuLabel>
              <DropdownMenuItem>
                <div
                  className="flex justify-between items-center w-full cursor-pointer text-sm"
                  onClick={() => handleNavigateToGroup("Global Group")}
                >
                  Global Group
                </div>
              </DropdownMenuItem>
              {user.joinedGroups.map(
                (group, index) =>
                  group !== "Global Group" && (
                    <DropdownMenuItem key={index}>
                      <div
                        className="flex justify-between items-center w-full cursor-pointer text-sm"
                        onClick={() => handleNavigateToGroup(group)}
                      >
                        {group}
                      </div>
                    </DropdownMenuItem>
                  )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {currentGroup !== "Global Group" && (
            <button
              onClick={() => handleQuitGroup(currentGroup)}
              className="text-red-500 hover:text-red-700 pl-2 pt-1"
            >
              Exit
            </button>
          )}
        </div>
        <div className="p-4 text-white">
          <p className="text-lg text-white font-medium mb-2">Group Members</p>
          {groupMembersLoading && <p>Loading...</p>}
          {groupMembersError && (
            <p className="text-red-500">Error loading members.</p>
          )}
          {groupMembersData && (
            <ul className="space-y-2">
              <li className="text-sm text-gray-400">Online Members:</li>
              {onlineMembers && onlineMembers.length > 0 ? (
                onlineMembers.map((member: User) => (
                  <li
                    key={member.username}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={member.profilePic || userImage}
                      alt="profile"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm">{member.username}</span>
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-400">No online members</li>
              )}
              <li className="text-sm text-gray-400">Offline Members:</li>
              {offlineMembers && offlineMembers.length > 0 ? (
                offlineMembers.map((member: User) => (
                  <li
                    key={member.username}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={member.profilePic || userImage}
                      alt="profile"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm">{member.username}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-400">No offline members</li>
              )}
            </ul>
          )}
        </div>
      </div>
      {showCreateGroup && <CreateGroup onCreateGroup={handleCreateGroup} />}
      {showJoinGroup && <JoinGroup onJoinGroup={handleJoinGroup} />}
    </div>
  );
};

export default Home;
