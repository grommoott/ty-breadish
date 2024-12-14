import { Recipe } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { RecipeId } from "@shared/model/types/primitives"
import Loading from "@shared/ui/Loading"
import Header from "@widgets/Header"
import { RecipeChangeForm } from "@widgets/ItemChangeForm"
import { FC, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"

const RecipeChangingPage: FC = () => {
	const params = useParams()
	const id = useMemo(() => {
		const param = params["id"]

		if (param == undefined) {
			console.error('There is no "id" in params')
			return
		}

		return new RecipeId(param)
	}, [params])

	const [recipe, setProduct] = useState<Recipe>()
	const [isLoading, setLoading] = useState(false)

	useEffect(() => {
		;(async () => {
			if (!id) {
				return
			}

			setLoading(true)
			const response = await Recipe.fromId(id)

			if (response instanceof ExError) {
				console.error(response)
				setLoading(false)
				return
			}

			setProduct(response)
			setLoading(false)
		})()
	}, [id])

	return (
		<>
			<Header />

			<div className="bg-zinc-900 flex flex-col items-center">
				{isLoading ? (
					<div className="m-4 p-4 rounded-3xl bg-[var(--dark-color)]">
						<Loading />
					</div>
				) : (
					<RecipeChangeForm recipe={recipe} />
				)}
			</div>
		</>
	)
}

export default RecipeChangingPage
