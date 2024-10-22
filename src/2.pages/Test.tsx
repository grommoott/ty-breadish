import { Recipe } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { RecipeId } from "@shared/model/types/primitives"
import { ReactElement, useEffect, useState } from "react"
import RecipeWrapper from "@entities/RecipeWrapper"
import CreateReviewForm from "@entities/CreateReviewForm"
import CreateReviewButton from "@features/CreateReviewButton"

export default function Test(): ReactElement {
	const [recipe, setRecipe] = useState<Recipe>()

	useEffect(() => {
		;(async () => {
			const recipe = await Recipe.fromId(new RecipeId(19))

			if (recipe instanceof ExError) {
				console.error(recipe)
				return
			}

			setRecipe(recipe)
		})()
	}, [])

	return (
		<div className="bg-zinc-900 flex flex-col items-center justify-center">
			{/* <AnimatedFullLogo /> */}

			{recipe && (
				<>
					<RecipeWrapper recipe={recipe} />
					<CreateReviewForm
						createReviewButton={(getContent, getRate) => (
							<CreateReviewButton
								getContent={getContent}
								getRate={getRate}
								target={recipe.itemId}
								onReview={console.log}
							/>
						)}
					/>
				</>
			)}

			<div className="h-60" />
		</div>
	)
}
