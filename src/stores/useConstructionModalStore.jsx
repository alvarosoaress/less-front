import { create } from "zustand";

const useConstructionModalStore = create((set) => ({
    openConstructionModal: false,
    closeConstructionModal: () => set(() => ({ openConstructionModal: false })),
    toggleConstructionModal: () => set((state) => ({ openConstructionModal: !state.openConstructionModal })),
}));

export default useConstructionModalStore;