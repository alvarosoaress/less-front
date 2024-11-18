import Close from "../assets/icons/close.svg"
import { motion } from "framer-motion";

export default function ConstructionCard({ data, onDelete, onClick, ...props }) {

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
                className="flex justify-between items-center w-full h-full p-2 px-3"
                onClick={onClick}
            >
                <h3 className="font-medium ">{data.name}</h3>
            </div>
            <motion.img className="p-2 px-3" src={Close} whileTap={{ opacity: .5, scale: .9 }} onClick={onDelete} />
        </motion.div>
    )
}