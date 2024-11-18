import Close from "../assets/icons/close.svg"
import { motion } from "framer-motion";
import { getInitials, shortName } from "../utils/employee"

export default function EmployeeCard({ data, onDelete, onClick, ...props }) {

    return (
        <motion.div
            className="flex justify-between items-center w-full border-[2px] border-blagray-200 rounded bg-white"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: .3 }}
            {...props}
        >
            <div
                className="flex items-center w-full h-full gap-3 p-2 px-3"
                onClick={onClick}
            >
                <span
                    className="flex justify-center items-center text-sm w-7 aspect-1 rounded-full bg-[#4284F7] text-white font-bold"
                    style={{ backgroundColor: data.color, color: data.color_text }}
                >
                    {shortName(data.name)}
                </span>
                <h3 className="font-medium ">{data.name}</h3>
            </div>
            <motion.img className="p-2 px-3" src={Close} whileTap={{ opacity: .5, scale: .9 }} onClick={onDelete} />
        </motion.div>
    )
}