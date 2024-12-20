import Header from "@widgets/Header"
import HomeWidget from "@widgets/HomeWidget"
import { FC } from "react"

const HomePage: FC = () => {
	return (
		<>
			<Header />
			<div className="bg-zinc-900">
				<HomeWidget />
			</div>
		</>
	)
}

export default HomePage
