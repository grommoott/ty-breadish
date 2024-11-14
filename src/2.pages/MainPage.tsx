import { AnimatedFullLogo } from "@shared/ui/Logos"
import { FC } from "react"
import { Button } from "@shared/ui/Buttons"
import { useNavigate } from "react-router-dom"
import Header from "@widgets/Header"
import {
	featuredActivatedImage,
	newsImage,
	recipesImage,
	shopImage,
} from "@assets/ui"
import { motion, Variants } from "framer-motion"

interface MainPageItemProps {
	imageUrl: string
	buttonLink: string
	description: string
	title: string
}

const MainPageItem: FC<MainPageItemProps> = ({
	imageUrl,
	buttonLink,
	description,
	title,
}) => {
	const navigate = useNavigate()

	return (
		<motion.div
			className="flex flex-col items-center w-40 mx-6 my-6 md:my-0"
			variants={mainPageItemVariants}
		>
			<h2 className="text-3xl text-center">{title}</h2>

			<div className="size-36">
				<img src={imageUrl} />
			</div>

			<p className="text-center">{description}</p>

			<Button onClick={() => navigate(buttonLink)}>Перейти</Button>
		</motion.div>
	)
}

const mainPageItemVariants: Variants = {
	hidden: {
		opacity: 0,
		y: -50,
	},
	shown: {
		opacity: 1,
		y: 0,
	},
}

const MainPage: FC = () => {
	return (
		<>
			<Header compact />
			<div className="flex flex-col items-center justify-center w-full bg-zinc-900">
				<AnimatedFullLogo />

				<motion.div
					initial="hidden"
					animate="shown"
					transition={{ staggerChildren: 0.2 }}
					className="flex flex-col md:flex-row items-center mb-4"
				>
					<MainPageItem
						title="Рецепты"
						imageUrl={recipesImage}
						buttonLink="/"
						description={`Пеките по самым лучшим рецептам от "Ты Breadish!"`}
					/>
					<MainPageItem
						title="Магазин"
						imageUrl={shopImage}
						buttonLink="/"
						description={`Покупайте самую вкусную выпечку на "Ты Breadish!"`}
					/>
					<MainPageItem
						title="Новости"
						imageUrl={newsImage}
						buttonLink="/"
						description={`Будьте в курсе самых новых новостей на "Ты Breadish!"`}
					/>
				</motion.div>

				<div className="h-20" />

				<MainPageItem
					title="Тестовая страница"
					imageUrl={featuredActivatedImage}
					buttonLink="/test"
					description={`Страница для разработчиков "Ты Breadish!"`}
				/>

				<div className="h-20" />
			</div>
		</>
	)
}

export default MainPage
