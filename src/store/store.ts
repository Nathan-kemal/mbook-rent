import { create } from "zustand";

interface SidebarState {
  sidebar: boolean;
  openCloseSidebar: () => void;
}

const useSidebarStore = create<SidebarState>((set) => ({
  sidebar: true,
  openCloseSidebar: () => set((state) => ({ sidebar: !state.sidebar })),
}));

type Role = "Admin" | "Owner" | null;
interface UserState {
  role: Role;
  id: string | null;
  setUser: (userrole: Role, id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: null,
  id: null,
  setUser: (userrole, id) => set({ role: userrole, id }),
}));

export default useSidebarStore;
