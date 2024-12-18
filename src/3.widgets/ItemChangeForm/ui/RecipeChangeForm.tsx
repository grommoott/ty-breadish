import { backendBaseUrl } from "@shared/config"
import { Item, Recipe } from "@shared/facades"
import { ImageId, ItemInfo } from "@shared/model/types/primitives"
import ImagePicker from "@shared/ui/ImagePicker"
import { MultilineFlatInput } from "@shared/ui/Inputs"
import { FC, useEffect, useState } from "react"
import { deleteImage, putImage } from "@shared/api/images"
import { ExError, searchImageIds } from "@shared/helpers"
import { CookingMethod, Ingredient } from "@shared/model/types/enums"
import { useNotification } from "@shared/hooks"
import { BaseErrorData, BaseFormData } from "../types"
import AddImageButton from "./AddImageButton"
import ItemChangeFormBase from "./ItemChangeFormBase"
import { useNavigate } from "react-router-dom"

interface RecipeChangeFormProps {
	recipe?: Recipe
	item?: Item
}

type ErrorData = BaseErrorData
type FormData = BaseFormData & {
	recipe: string
}

const RecipeChangeForm: FC<RecipeChangeFormProps> = ({ recipe }) => {
	const isChanging = recipe != undefined

	const [images, setImages] = useState(new Array<ImageId>())
	const [externalImages, setExternalImages] = useState(new Array<ImageId>())
	const [internalImages, setInternalImages] = useState(new Array<ImageId>())

	const [formData, setFormData] = useState<FormData>({
		name: recipe?.name || "",
		description: recipe?.description || "",
		carbs: recipe?.itemInfo.pfc.carbs.toString() || "",
		protein: recipe?.itemInfo.pfc.protein.toString() || "",
		fat: recipe?.itemInfo.pfc.fat.toString() || "",
		kkal: recipe?.itemInfo.pfc.kkal.toString() || "",
		mass: recipe?.itemInfo.mass.toString() || "",
		cookingMethods:
			recipe?.itemInfo.cookingMethod || new Array<CookingMethod>(),
		ingredients: recipe?.itemInfo.ingredients || new Array<Ingredient>(),
		recipe: recipe?.recipe || "",
	})

	const [errorData, setErrorData] = useState<ErrorData>({})

	const notificate = useNotification()
	const navigate = useNavigate()

	useEffect(() => {
		setInternalImages(searchImageIds(formData.recipe))
	}, [formData.recipe])

	useEffect(() => {
		const concatedImages = new Array().concat(
			externalImages,
			internalImages,
		)

		setImages(
			concatedImages.filter(
				(id, index) =>
					concatedImages.findIndex((val) => val.id == id.id) == index,
			),
		)
	}, [internalImages, externalImages])

	const updateOrCreateRecipe = async () => {
		const errorData: any = { pfc: {} }

		let error = false

		if (formData.name == "") {
			errorData.name = "Имя не может быть пустым"
			error = true
		}

		if (formData.carbs == "") {
			errorData.pfc.carbs = "Количество углеродов должно быть определено"
			error = true
		}

		if (formData.protein == "") {
			errorData.pfc.protein = "Количество белков должно быть определено"
			error = true
		}

		if (formData.fat == "") {
			errorData.pfc.fat = "Количество жиров должно быть определено"
			error = true
		}

		if (formData.kkal == "") {
			errorData.pfc.kkal =
				"Энергетическая ценность должна быть определена"
			error = true
		}

		if (formData.mass == "") {
			errorData.mass = "Масса должна быть определена"
			error = true
		}

		if (!isChanging && formData.image == undefined) {
			errorData.image =
				"Для создания рецепта необходимо выбрать изображение для него"
			error = true
		}

		setErrorData(errorData)

		if (error) {
			return
		}

		const itemInfo = new ItemInfo(
			formData.cookingMethods,
			formData.ingredients,
			{
				protein: parseFloat(formData.protein),
				fat: parseFloat(formData.fat),
				carbs: parseFloat(formData.carbs),
				kkal: parseFloat(formData.kkal),
			},
			parseFloat(formData.mass),
		)

		if (isChanging) {
			const recipe_ = await Recipe.fromId(recipe.id)

			if (recipe_ instanceof ExError) {
				console.error(recipe_)
				return
			}

			const response = await recipe_.edit(
				formData.name,
				formData.description,
				itemInfo,
				formData.recipe,
				formData.image,
			)

			if (response instanceof ExError) {
				console.error(response)
				notificate("Произошла ошибка")
				return
			}

			notificate("Рецепт успешно изменён")
		} else {
			if (!formData.image) {
				return
			}

			const response = await Recipe.create(
				formData.name,
				formData.description,
				itemInfo,
				formData.recipe,
				formData.image,
			)

			if (response instanceof ExError) {
				console.error(response)
				notificate("Произошла ошибка")
				return
			}

			navigate(`/recipes/id/${response.id.id}`)
		}
	}

	return (
		<ItemChangeFormBase
			subjectNameOf="рецепта"
			subjectNameWhat="рецепт"
			errorData={errorData}
			setErrorData={setErrorData}
			formData={formData}
			setFormData={setFormData}
			updateOrCreateItem={updateOrCreateRecipe}
			item={recipe}
		>
			<div className="p-4">
				<h2>Содержание</h2>
				<div className="p-4 rounded-3xl bg-zinc-800 my-2">
					<MultilineFlatInput
						content={formData.recipe}
						setContent={(val) =>
							setFormData({ ...formData, recipe: val })
						}
						className="w-full h-min"
						autoHeight
					/>
				</div>

				<h2>Изображения</h2>
				<div className="flex flex-row justify-start flex-wrap">
					{images.map((id, index) => {
						return (
							<div
								className="flex flex-col items-center"
								key={index}
							>
								<p className="text-white">
									<span className="text-base text-zinc-700 select-none">
										ID:
									</span>{" "}
									{id.id}
								</p>

								<ImagePicker
									compact
									deletable
									defaultUrl={`${backendBaseUrl}/api/images/id/${id}`}
									onChange={async (file) => {
										const response = await putImage(
											id,
											file,
										)

										if (response instanceof ExError) {
											console.error(response)
										}
									}}
									onDelete={async () => {
										const response = await deleteImage(id)

										if (response instanceof ExError) {
											console.error(response)
										}
									}}
								/>
							</div>
						)
					})}

					<AddImageButton
						onImage={(id) =>
							setExternalImages(externalImages.concat(id))
						}
					/>
				</div>
			</div>
		</ItemChangeFormBase>
	)
}

export { RecipeChangeForm }
