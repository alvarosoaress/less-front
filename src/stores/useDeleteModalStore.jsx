import { create } from "zustand";

const useDeleteModalStore = create((set) => ({
    openDeleteModal: false,
    deleteConstructionId: null,
    toggleDeleteModal: () => set((state) => ({ openDeleteModal: !state.openDeleteModal })),
    setDeleteID: (data) => set(() => ({ deleteConstructionId: data })),
}));

export default useDeleteModalStore;