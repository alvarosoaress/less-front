import LoadingIcon from "../assets/icons/loading.svg"
import { motion } from "framer-motion"

export default function Loading({ text }) {
    return (
        <motion.div
            className="fixed w-full h-full flex justify-center items-center left-0 bottom-0 bg-[#00000090] 0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="flex flex-col items-center">
                <h1 className="font-medium text-lg text-white">{text}</h1>
                <motion.img
                    className="w-[70px]"
                    src={LoadingIcon}
                    animate={{ rotate: 360 }}
                    transition={{ duration: .5, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </motion.div>
    )
}