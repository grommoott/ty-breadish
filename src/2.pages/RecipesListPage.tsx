import Header from "@widgets/Header"
import { RecipesListWidget } from "@widgets/ItemsListWidgets"
import { FC } from "react"

const RecipesListPage: FC = () => {
	return (
		<>
			<Header />

			<div className="bg-zinc-900">
				<RecipesListWidget />
			</div>
		</>
	)
}

export default RecipesListPage
