import { ChevronDown, FilePlus2, Send } from "lucide-react";

const Home = () => {
  return (
    <div className="flex h-screen p-20 justify-between gap-10">
      <div className="bg-white w-full rounded-2xl bg-opacity-30 relative ">
        <div className="absolute w-full bottom-0 p-4 ">
          <div className="bg-white flex justify-center items-center px-4 rounded-2xl">
            <FilePlus2 className="opacity-60 hover:opacity-100 cursor-pointer" />
            <input
              className="outline-none w-full p-2 pl-4"
              placeholder="W's in the chat"
            />
            <Send className="opacity-60 hover:opacity-100 cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="bg-white w-96 rounded-2xl bg-opacity-30 ">
        <div className="flex justify-center items-center">
          <p className="text-white text-xl text-center p-2 font-medium">
            Global Group
          </p>
          <ChevronDown color="white" className="cursor-pointer " />
        </div>
      </div>
    </div>
  );
};

export default Home;
