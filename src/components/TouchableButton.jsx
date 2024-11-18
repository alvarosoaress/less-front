import { motion } from "framer-motion";

export default function TouchableButton({ onClick, children }) {
    return (
        <motion.div
            onClick={onClick}
            className="flex justify-center items-center p-1 rounded-full"
            whileTap={{ backgroundColor: "rgba(227, 227, 227, 0.5)" }}
        >
            {children}
        </motion.div>
    )
}