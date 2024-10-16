import { Recipe } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { RecipeId } from "@shared/model/types/primitives"
import Loading from "@shared/ui/Loading"
import { AnimatedFullLogo } from "@shared/ui/Logos"
import RecipeChangeForm from "@widgets/RecipeChangeForm"
import { ReactElement, useEffect, useState } from "react"

export default function Test(): ReactElement {
	const [recipe, setRecipe] = useState<Recipe>()

	useEffect(() => {
		;(async () => {
			const response = await Recipe.fromId(new RecipeId(19))

			if (response instanceof ExError) {
				console.error(response)
				return
			}

			setRecipe(response)
		})()
	}, [])

	return (
		<div className="bg-zinc-900 flex flex-col items-center justify-center">
			<AnimatedFullLogo />

			{recipe ? <RecipeChangeForm recipe={recipe} /> : <Loading />}

			<div className="h-60" />
		</div>
	)
}
