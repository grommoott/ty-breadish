import Header from "@widgets/Header"
import { RecipeChangeForm } from "@widgets/ItemChangeForm"
import { FC } from "react"

const RecipeCreationPage: FC = () => {
	return (
		<>
			<Header />
			<div className="bg-zinc-900 flex flex-col items-center">
				<RecipeChangeForm />
			</div>
		</>
	)
}

export default RecipeCreationPage
