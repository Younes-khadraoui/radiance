import { create } from "zustand";

interface IGroupStore {
  showCreateGroup: boolean;
  setShowCreateGroup: (value: boolean) => void;
  showJoinGroup: boolean;
  setShowJoinGroup: (value: boolean) => void;
  currentGroup: string;
  setCurrentGroup: (groupName: string) => void;
}

export const useGroupStore = create<IGroupStore>((set) => ({
  showCreateGroup: false,
  setShowCreateGroup: (value: boolean) => set({ showCreateGroup: value }),
  showJoinGroup: false,
  setShowJoinGroup: (value: boolean) => set({ showJoinGroup: value }),
  currentGroup: "",
  setCurrentGroup: (groupName: string) => set({ currentGroup: groupName }),
}));
