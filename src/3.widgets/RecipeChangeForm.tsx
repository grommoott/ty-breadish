import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import { Recipe } from "@shared/facades"
import ImagePicker from "@shared/ui/ImagePicker"
import { MultilineFlatInput, ValidatedInput } from "@shared/ui/Inputs"
import { FC, useEffect, useState } from "react"

interface RecipeChangeFormProps {
	recipe?: Recipe
}

const RecipeChangeForm: FC<RecipeChangeFormProps> = ({ recipe }) => {
	const isChanging = recipe != undefined

	const pageSize = usePageSize()
	const [width, setWidth] = useState(50)

	const [content, setContent] = useState(recipe?.recipe || "")

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
			className="flex flex-col items-stretch p-4 bg-[var(--dark-color)] rounded-3xl"
			style={{ width: `${width}vw` }}
		>
			<h1 className="text-xl sm:text-2xl text-center">
				{isChanging
					? `Изменение рецепта "${recipe.name}"`
					: "Создание рецепта"}
			</h1>

			<div className="self-center">
				<ImagePicker defaultUrl="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2F6xEiuNtcu6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=2c16113a27abe87c77ac85f3d0d6d0517e9af8087582fa8355a3e62700af0abc&ipo=images" />
			</div>

			<p className="text-base text-zinc-700 text-center">
				Рекомендуемое соотношение сторон для главного изображения
				рецепта - 4:3
			</p>

			<div className="p-4">
				<h2>Название</h2>
				<ValidatedInput
					margin="0.5rem 0"
					width="100%"
					placeholder="Название"
					value={recipe?.name}
				/>
			</div>

			<div className="p-4">
				<h2>Описание</h2>
				<ValidatedInput
					margin="0.5rem 0"
					width="100%"
					placeholder="Описание"
					value={recipe?.description}
				/>
			</div>

			<div className="p-4">
				<h2>Содержание</h2>
				<div className="p-4 rounded-3xl bg-zinc-800 my-2">
					<MultilineFlatInput
						content={content}
						setContent={setContent}
						className="w-full h-min"
						autoHeight
					/>
				</div>
			</div>
		</div>
	)
}

export default RecipeChangeForm
