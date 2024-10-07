import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import { Recipe } from "@shared/facades"
import { ItemType, ItemTypes } from "@shared/model/types/enums"
import { ItemId } from "@shared/model/types/primitives"
import Loading from "@shared/ui/Loading"
import { FC, ReactNode, useEffect, useState } from "react"

interface RecipeWrapperProps {
	recipe?: Recipe
	featuredButton?: (itemId: ItemId, itemType: ItemType) => ReactNode
}

const RecipeWrapper: FC<RecipeWrapperProps> = ({
	recipe,
	featuredButton = () => {},
}) => {
	if (!recipe) {
		return (
			<div className="p-4 bg-[var(--dark-color)] rounded-3xl">
				<Loading />
			</div>
		)
	}

	const pageSize = usePageSize()
	const [width, setWidth] = useState(50)

	useEffect(() => {
		if (pageSize > PageSizes.XXL) {
			setWidth(40)
		} else if (pageSize > PageSizes.XL) {
			setWidth(50)
		} else if (pageSize > PageSizes.Medium) {
			setWidth(60)
		} else if (pageSize > PageSizes.SmallMedium) {
			setWidth(75)
		} else if (pageSize > PageSizes.Small) {
			setWidth(90)
		}
	}, [pageSize])

	return (
		<div
			className="flex flex-col p-4 bg-[var(--dark-color)] rounded-3xl"
			style={{ width: `${width}vw` }}
		>
			<div className="flex flex-col sm:flex-row gap-2 sm:gap-16 items-center sm:items-stretch justify-center sm:justify-between">
				<div className="p-2 rounded-3xl bg-zinc-900">
					<img
						src={recipe.imageLink}
						className="w-60 sm:w-80 object-cover drop-shadow-2xl"
					/>
				</div>

				<div className="flex flex-col items-center sm:items-end flex-1">
					<div className="flex flex-row items-center gap-4">
						<h1 className="text-3xl ml-2">{recipe.name}</h1>
						<>{featuredButton(recipe.itemId, ItemTypes.Recipe)}</>
					</div>
				</div>
			</div>
		</div>
	)
}

export default RecipeWrapper
