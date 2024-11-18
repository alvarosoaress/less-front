import { motion } from "framer-motion"

export default function Button({ title, enabled, color = "#4284F7", textColor = "#FFF", onClick, ...props }) {
    return (
        <motion.button
            animate={{
                backgroundColor: enabled ? color : "#CCC",
                color: enabled ? textColor : "#000"
            }}
            className="p-2 mx-2 rounded font-medium"
            whileTap={{ opacity: 0.8 }}
            onClick={enabled ? () => onClick() : null}
            {...props}
        >
            {title}
        </motion.button>
    )
}