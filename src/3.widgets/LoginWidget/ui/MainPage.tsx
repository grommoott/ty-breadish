import { FC } from "react"
import { LoginPageBaseProps } from "../types"
import { Button } from "@shared/ui/Buttons"
import { FullLogo } from "@shared/ui/Logos"
import { LoginPages } from "../enums"
import { motion } from "framer-motion"
import { loginPageVariants } from "../animations"

interface MainPageProps extends LoginPageBaseProps {}

const MainPage: FC<MainPageProps> = ({ goToPage }) => {
	return (
		<motion.div
			initial="initial"
			animate="show"
			exit="hide"
			variants={loginPageVariants}
			className="flex flex-col items-center max-w-[80vw]"
		>
			<div>
				<FullLogo size={15} />
			</div>
			<Button
				className="w-full"
				onClick={() => goToPage(LoginPages.Login)}
			>
				Войти
			</Button>
			<Button
				className="w-full"
				onClick={() => goToPage(LoginPages.Register)}
			>
				<p className="text-center overflow-x-hidden">
					Зарегистрироваться
				</p>
			</Button>
		</motion.div>
	)
}

export default MainPage
