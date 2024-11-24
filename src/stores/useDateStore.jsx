import { create } from "zustand";
import { getRange, getWeekDays, getWeekNumber } from "../utils/day";
import { getWorksByRange } from "../service/apiService";

const activeWeek = getWeekDays(new Date())

const useDateStore = create((set) => ({
    activeDay: new Date(),
    activeWeek: activeWeek,
    activeWeekNum: getWeekNumber(new Date()),
    constructions: [],
    setActiveDay: (data) => set(() => ({ activeDay: data })),
    setActiveWeek: (data) => set(() => ({ activeWeek: data })),
    setActiveWeekNum: (data) => set(() => ({ activeWeekNum: data })),
    setConstructions: (data) => set(() => ({ constructions: data })),
    refreshConstructions: async (data) => {
        const { first, last } = getRange(data);
        const result = await getWorksByRange(first, last);
        result.sort((a,b) => a.code > b.code)
        set(() => ({
            constructions: result
        }));
    },
}));

export default useDateStore;