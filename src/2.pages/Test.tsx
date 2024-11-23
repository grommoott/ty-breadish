import Header from "@widgets/Header"
import { RecipesListWidget } from "@widgets/ItemsListWidgets/ui/RecipesListWidget"
import { ReactElement } from "react"

export default function Test(): ReactElement {
	return (
		<>
			<Header />

			<div className="bg-zinc-900">
				<RecipesListWidget />
			</div>
		</>
	)
}
