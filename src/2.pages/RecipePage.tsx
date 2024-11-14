import { Recipe } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { RecipeId } from "@shared/model/types/primitives"
import Header from "@widgets/Header"
import { RecipeWidget } from "@widgets/ItemWidgets"
import { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

type RecipePageParams = {
	id: string
}

const RecipePage: FC = () => {
	const [recipe, setRecipe] = useState<Recipe>()

	const params = useParams<RecipePageParams>()

	useEffect(() => {
		;(async () => {
			if (!params.id) {
				return
			}

			const response = await Recipe.fromId(new RecipeId(params.id))

			if (response instanceof ExError) {
				console.error(response)
				return
			}

			setRecipe(response)
		})()
	}, [])

	return (
		<>
			<Header />

			<div className="bg-zinc-900">
				<RecipeWidget recipe={recipe} />
			</div>
		</>
	)
}

export default RecipePage
