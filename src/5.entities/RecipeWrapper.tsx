import { OwnedUser, Recipe } from "@shared/facades"
import { replaceImageIds } from "@shared/helpers"
import { useDefaultWidgetWidth } from "@shared/hooks"
import {
	ItemType,
	ItemTypes,
	Roles,
	translateCookingMethod,
	translateIngredient,
} from "@shared/model/types/enums"
import { ItemId } from "@shared/model/types/primitives"
import { AccentButton } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import Star from "@shared/ui/Star"
import Tag from "@shared/ui/Tag"
import { FC, ReactNode, useMemo } from "react"
import Markdown from "react-markdown"
import { useNavigate } from "react-router-dom"
import remarkGfm from "remark-gfm"

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

	const recipeContent = useMemo(
		() => replaceImageIds(recipe.recipe),
		[recipe],
	)

	const width = useDefaultWidgetWidth()
	const navigate = useNavigate()

	return (
		<div
			className="flex flex-col p-4 bg-[var(--dark-color)] rounded-3xl gap-4 my-4"
			style={{ width: `${width}vw` }}
		>
			<div className="flex flex-col sm:flex-row gap-2 sm:gap-16 items-center sm:items-stretch justify-center sm:justify-between">
				<div className="p-2 rounded-3xl bg-zinc-900 h-min">
					<img
						src={recipe.imageLink}
						className="w-60 lg:w-80 object-cover drop-shadow-2xl"
					/>
				</div>

				<div className="flex flex-col items-center sm:items-end flex-1">
					<div className="flex flex-row items-center gap-4">
						<h1
							className="text-3xl ml-2"
							style={{ overflowWrap: "anywhere" }}
						>
							{recipe.name}
						</h1>
						<>{featuredButton(recipe.itemId, ItemTypes.Recipe)}</>
					</div>

					{recipe.avgRate.avgRate != -1 && (
						<div className="flex flex-row items-center">
							{recipe.avgRate.avgRate == -1 ? (
								<p className="text-zinc-700">Нет отзывов</p>
							) : (
								<>
									{[0, 1, 2, 3, 4].map((val) => {
										return (
											<Star
												fillRatio={
													recipe.avgRate.avgRate - val
												}
												key={val}
											/>
										)
									})}

									<p className="text ml-2">
										{recipe.avgRate.avgRate.toFixed(1)}
									</p>
								</>
							)}
						</div>
					)}

					<div className="grow"></div>

					{OwnedUser.instance?.role == Roles.Admin && (
						<AccentButton
							onClick={() =>
								navigate(`/recipes/change/id/${recipe.id.id}`)
							}
						>
							Изменить рецепт
						</AccentButton>
					)}
				</div>
			</div>

			<div className="p-2 w-full">
				<h2 className="text-2xl">Описание</h2>
				<p className="text-center sm:text-start">
					{recipe.description}
				</p>
			</div>

			<div className="p-2 w-full">
				<h2 className="text-2xl">Информация</h2>

				<div className="flex flex-row flex-wrap items-center">
					<p className="mr-1">Способ приготовления:</p>
					{recipe.itemInfo.cookingMethod.map((method) => {
						const translated = translateCookingMethod(method)

						return (
							<Tag key={method}>
								{translated[0].toUpperCase() +
									translated.slice(1)}
							</Tag>
						)
					})}
				</div>

				<div style={{ height: "0.25rem" }} />

				<div className="flex flex-row flex-wrap items-center">
					<p className="mr-1">Ингредиенты:</p>
					{recipe.itemInfo.ingredients.map((val) => (
						<Tag key={val}>
							{(() => {
								const ingredient = translateIngredient(val)

								return (
									ingredient[0].toUpperCase() +
									ingredient.slice(1)
								)
							})()}
						</Tag>
					))}
				</div>

				<div style={{ height: "0.25rem" }} />

				<div className="flex flex-row flex-wrap items-center">
					<p className="mr-1">Питательность на 100г:</p>
					<Tag>Белки: {recipe.itemInfo.pfc.protein}г</Tag>
					<Tag>Жиры: {recipe.itemInfo.pfc.fat}г</Tag>
					<Tag>Угреводы: {recipe.itemInfo.pfc.carbs}г</Tag>
					<Tag>{recipe.itemInfo.pfc.kkal}ккал</Tag>
				</div>

				<div style={{ height: "0.25rem" }} />

				<div className="flex flex-row flex-wrap items-center">
					<p className="mr-1">Масса:</p>
					<Tag>{recipe.itemInfo.mass}г</Tag>
				</div>
			</div>

			<div className="markdown-container p-4 bg-zinc-900 rounded-2xl">
				<Markdown remarkPlugins={[[remarkGfm]]}>
					{recipeContent}
				</Markdown>
			</div>
		</div>
	)
}

export default RecipeWrapper
