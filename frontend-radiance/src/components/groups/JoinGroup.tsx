import { useGroupStore } from "@/stores/groupStore";
import { X } from "lucide-react";
import { useState, ChangeEvent, KeyboardEvent } from "react";

interface JoinGroupProps {
  onJoinGroup: (groupName: string) => void;
}

const JoinGroup = ({ onJoinGroup }: JoinGroupProps) => {
  const { setShowJoinGroup } = useGroupStore();
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGroupName(event.target.value);
    setError("");
  };

  const handleJoin = () => {
    if (groupName.trim() === "") {
      setError("Group name cannot be empty.");
      return;
    }
    onJoinGroup(groupName);
    setGroupName("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleJoin();
    }
  };

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-96 h-96 rounded-2xl bg-opacity-20">
        <div className="flex justify-between items-center p-4">
          <p className="text-xl font-semibold text-white">Join Group</p>
          <button
            className="text-white bg-red-500 px-2 py-1 rounded-lg"
            onClick={() => setShowJoinGroup(false)}
          >
            <X />
          </button>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Group Name"
            className="w-full p-2 rounded-lg outline-none"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={groupName}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <div className="flex pt-2 ">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 mr-2 flex-1"
              onClick={handleJoin}
            >
              Join
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-md hover:bg-gray-400 flex-1"
              onClick={() => onJoinGroup("")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroup;
