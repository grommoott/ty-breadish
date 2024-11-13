import { Variants } from "framer-motion";

const loginPageVariants: Variants = {
    show: {
        y: 0,
        opacity: 1,
    },
    hide: {
        y: -200,
        opacity: 0,
    },
    initial: {
        y: 200,
        opacity: 0,
    }
}

export { loginPageVariants }
