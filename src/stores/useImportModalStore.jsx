import { create } from "zustand";

const useImportModalStore = create((set) => ({
    openImportModal: false,
    toggleImportModal: () => set((state) => ({ openImportModal: !state.openImportModal })),
}));

export default useImportModalStore;