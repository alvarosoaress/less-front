import { create } from "zustand";

const useEmployeeModalStore = create((set) => ({
    openEmployeeModal: false,
    openEditDayModal: false,
    employees: [],
    employeeEdit: {},
    toggleEmployeeModal: () => set((state) => ({ openEmployeeModal: !state.openEmployeeModal })),
    closeEmployeeModal: () => set(() => ({ openEmployeeModal: false })),
    toggleEditDayModal: () => set((state) => ({ openEditDayModal: !state.openEditDayModal })),
    closeEditDayModal: () => set(() => ({ openEditDayModal: false })),
    setEmployees: (data) => set(() => ({ employees: data })),
    setEmployeeEdit: (data) => set(() => ({ employeeEdit: data })),
}));

export default useEmployeeModalStore;