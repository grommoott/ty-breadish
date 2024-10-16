import { backendBaseUrl } from "@shared/config"
import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import { Recipe } from "@shared/facades"
import { ImageId, ItemInfo } from "@shared/model/types/primitives"
import ImagePicker from "@shared/ui/ImagePicker"
import { MultilineFlatInput, ValidatedInput } from "@shared/ui/Inputs"
import { FC, useEffect, useState } from "react"
import AddImageButton from "./ui/AddImageButton"
import { deleteImage, putImage } from "@shared/api/images"
import { ExError } from "@shared/helpers"
import { Button } from "@shared/ui/Buttons"
import FoldableItem from "@shared/ui/FoldableItem"
import MultiSelect from "@shared/ui/MultiSelect"
import {
	CookingMethod,
	CookingMethods,
	Ingredient,
	Ingredients,
	translateCookingMethod,
	translateIngredient,
} from "@shared/model/types/enums"
import { imageImage } from "@assets/ui"
import { useNotification, usePopupWindow } from "@shared/hooks"
import Loading from "@shared/ui/Loading"

interface RecipeChangeFormProps {
	recipe?: Recipe
}

const RecipeChangeForm: FC<RecipeChangeFormProps> = ({ recipe }) => {
	const isChanging = recipe != undefined

	const pageSize = usePageSize()
	const [width, setWidth] = useState(50)

	const [recipeImage, setRecipeImage] = useState<File>()

	const [images, setImages] = useState(new Array<ImageId>())
	const [externalImages, setExternalImages] = useState(new Array<ImageId>())
	const [internalImages, setInternalImages] = useState(new Array<ImageId>())

	// Form data
	const [name, setName] = useState(recipe?.name || "")
	const [description, setDescription] = useState(recipe?.description || "")

	const [carbs, setCarbs] = useState(
		recipe?.itemInfo.pfc.carbs.toString() || "",
	)
	const [protein, setProtein] = useState(
		recipe?.itemInfo.pfc.protein.toString() || "",
	)
	const [fat, setFat] = useState(recipe?.itemInfo.pfc.fat.toString() || "")
	const [kkal, setKkal] = useState(recipe?.itemInfo.pfc.kkal.toString() || "")

	const [mass, setMass] = useState(recipe?.itemInfo.mass.toString() || "")
	const [cookingMethods, setCookingMethods] = useState(
		recipe?.itemInfo.cookingMethod || new Array<CookingMethod>(),
	)
	const [ingredients, setIngredients] = useState(
		recipe?.itemInfo.ingredients || new Array<Ingredient>(),
	)
	const [content, setContent] = useState(recipe?.recipe || "")

	const [errorData, setErrorData] = useState<{
		name?: string
		image?: string
		mass?: string
		pfc?: { carbs?: string; protein?: string; fat?: string; kkal?: string }
	}>()

	const notificate = useNotification()
	const popupWindow = usePopupWindow()
	const [isLoading, setLoading] = useState(false)

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

	useEffect(() => {
		const images = new Array<ImageId>()

		const matches = content.matchAll(/\[[^\]]*\]\(image:([0-9]*)\)/gm)

		for (const match of matches) {
			if (match.length < 1 || match[1] == "") {
				return
			}

			images.push(new ImageId(match[1]))
		}

		setInternalImages(images)
	}, [content])

	useEffect(() => {
		const concatedImages = new Array().concat(
			externalImages,
			internalImages,
		)

		setImages(
			concatedImages.filter((id, index) => {
				return (
					concatedImages.findIndex((val) => val.id == id.id) == index
				)
			}),
		)
	}, [internalImages, externalImages])

	const updateOrCreateRecipe = async () => {
		const errorData: any = { pfc: {} }

		let error = false

		if (name == "") {
			errorData.name = "Имя не может быть пустым"
			error = true
		}

		if (carbs == "") {
			errorData.pfc.carbs = "Количество углеродов должно быть определено"
			error = true
		}

		if (protein == "") {
			errorData.pfc.protein = "Количество белков должно быть определено"
			error = true
		}

		if (fat == "") {
			errorData.pfc.fat = "Количество жиров должно быть определено"
			error = true
		}

		if (kkal == "") {
			errorData.pfc.kkal =
				"Энергетическая ценность должна быть определена"
			error = true
		}

		if (mass == "") {
			errorData.mass = "Масса должна быть определена"
			error = true
		}

		if (!isChanging && recipeImage == undefined) {
			errorData.image =
				"Для создания рецепта необходимо выбрать изображение для него"
			error = true
		}

		setErrorData(errorData)

		if (error) {
			return
		}

		const itemInfo = new ItemInfo(
			cookingMethods,
			ingredients,
			{
				protein: parseFloat(protein),
				fat: parseFloat(fat),
				carbs: parseFloat(carbs),
				kkal: parseFloat(kkal),
			},
			parseFloat(mass),
		)

		if (isChanging) {
			setLoading(true)

			const recipe_ = await Recipe.fromId(recipe.id)

			if (recipe_ instanceof ExError) {
				console.error(recipe_)
				return
			}

			const response = await recipe_.edit(
				name,
				description,
				itemInfo,
				content,
				recipeImage,
			)

			if (response instanceof ExError) {
				console.error(response)
				setLoading(false)
				notificate("Произошла ошибка")
				return
			}

			setLoading(false)
			notificate("Рецепт успешно изменён")
		} else {
			if (!recipeImage) {
				return
			}

			setLoading(true)

			const response = await Recipe.create(
				name,
				description,
				itemInfo,
				content,
				recipeImage,
			)

			if (response instanceof ExError) {
				console.error(response)
				setLoading(false)
				notificate("Произошла ошибка")
				return
			}
		}
	}

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
				<ImagePicker
					defaultUrl={isChanging ? recipe.imageLink : imageImage}
					error={errorData?.image}
					onChange={(image) => {
						setRecipeImage(image)
						setErrorData((prev) => ({ ...prev, image: undefined }))
					}}
					onDelete={() => setRecipeImage(undefined)}
				/>
			</div>

			<p className="text-base text-zinc-700 text-center">
				Рекомендуемое соотношение сторон для главного изображения
				рецепта - 4:3
			</p>

			<div className="p-4">
				<h2>Название</h2>
				<ValidatedInput
					margin="0.5rem 0"
					error={errorData?.name}
					width="100%"
					placeholder="Название"
					onChange={(val) => {
						setName(val)
						setErrorData((prev) => ({ ...prev, name: undefined }))
					}}
					value={recipe?.name}
				/>
			</div>

			<div className="p-4">
				<h2>Описание</h2>
				<ValidatedInput
					margin="0.5rem 0"
					width="100%"
					placeholder="Описание"
					onChange={setDescription}
					value={recipe?.description}
				/>
			</div>

			<div className="p-4">
				<h2>Информация</h2>

				<FoldableItem
					title="Энергетическая ценность на 100 г"
					width="100%"
					contentAlign="stretch"
					contentPadding="2rem"
				>
					<div className="flex flex-row items-center">
						<p>Белки:</p>
						<ValidatedInput
							error={errorData?.pfc?.protein}
							placeholder="Белки"
							value={recipe?.itemInfo.pfc.protein.toString()}
							onChange={() =>
								setErrorData((prev) => ({
									...prev,
									pfc: { ...prev?.pfc, protein: undefined },
								}))
							}
							validator={(val) => {
								if (!Number(val)) {
									return "Это поле принимает только числовые значения с десятичным разделителем в виде точки, например: 42.4"
								}
								setProtein(val)
								return ""
							}}
						/>
					</div>

					<div className="flex flex-row items-center">
						<p>Жиры:</p>
						<ValidatedInput
							error={errorData?.pfc?.fat}
							placeholder="Жиры"
							value={recipe?.itemInfo.pfc.fat.toString()}
							onChange={() =>
								setErrorData((prev) => ({
									...prev,
									pfc: { ...prev?.pfc, fat: undefined },
								}))
							}
							validator={async (val) => {
								if (!Number(val)) {
									return "Это поле принимает только числовые значения с десятичным разделителем в виде точки, например: 42.4"
								}
								setFat(val)
								return ""
							}}
						/>
					</div>

					<div className="flex flex-row items-center">
						<p>Углеводы:</p>
						<ValidatedInput
							error={errorData?.pfc?.carbs}
							placeholder="Углеводы"
							value={recipe?.itemInfo.pfc.carbs.toString()}
							onChange={() =>
								setErrorData((prev) => ({
									...prev,
									pfc: { ...prev?.pfc, carbs: undefined },
								}))
							}
							validator={(val) => {
								if (!Number(val)) {
									return "Это поле принимает только числовые значения с десятичным разделителем в виде точки, например: 42.4"
								}
								setCarbs(val)
								return ""
							}}
						/>
					</div>

					<div className="flex flex-row items-center">
						<p>ККал:</p>
						<ValidatedInput
							error={errorData?.pfc?.kkal}
							placeholder="Кило калорий"
							value={recipe?.itemInfo.pfc.kkal.toString()}
							onChange={() =>
								setErrorData((prev) => ({
									...prev,
									pfc: { ...prev?.pfc, kkal: undefined },
								}))
							}
							validator={(val) => {
								if (!Number(val)) {
									return "Это поле принимает только числовые значения с десятичным разделителем в виде точки, например: 42.4"
								}
								setKkal(val)
								return ""
							}}
						/>
					</div>
				</FoldableItem>

				<FoldableItem
					title="Ингредиенты"
					width="100%"
					contentAlign="stretch"
					contentPadding="2rem"
				>
					<div className="pb-4">
						<MultiSelect
							selectedValues={ingredients}
							values={Object.values(Ingredients)}
							translator={(val) => {
								const translated = translateIngredient(
									val as Ingredient,
								)

								return (
									translated[0].toUpperCase() +
									translated.substring(1)
								)
							}}
							onSelect={(val) =>
								setIngredients(
									ingredients.concat(val as Ingredient),
								)
							}
							onDelete={(val) =>
								setIngredients(
									ingredients.filter(
										(ingredient) => ingredient != val,
									),
								)
							}
						/>
					</div>
				</FoldableItem>

				<FoldableItem
					title="Прочее"
					width="100%"
					contentAlign="stretch"
					contentPadding="2rem"
				>
					<div className="flex flex-row items-center">
						<p>Масса в граммах:</p>
						<ValidatedInput
							placeholder="Масса"
							value={recipe?.itemInfo.mass.toString()}
							error={errorData?.mass}
							onChange={() =>
								setErrorData((prev) => ({
									...prev,
									mass: undefined,
								}))
							}
							validator={(val) => {
								if (!Number(val)) {
									return "Это поле принимает только числовые значения с десятичным разделителем в виде точки, например: 42.4"
								}
								setMass(val)
								return ""
							}}
						/>
					</div>
					<div className="flex flex-col items-center self-stretch pb-4">
						<h2>Способы приготовления</h2>
						<MultiSelect
							selectedValues={cookingMethods}
							values={Object.values(CookingMethods)}
							translator={(val) => {
								const translated = translateCookingMethod(
									val as CookingMethod,
								)

								return (
									translated[0].toUpperCase() +
									translated.substring(1)
								)
							}}
							onSelect={(val) =>
								setCookingMethods(
									cookingMethods.concat(val as CookingMethod),
								)
							}
							onDelete={(val) => {
								setCookingMethods(
									cookingMethods.filter(
										(value) => value != val,
									),
								)
							}}
						/>
					</div>
				</FoldableItem>
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

			<div className="p-4 w-full">
				{isChanging ? (
					<>
						<Button
							className="w-full flex flex-row items-center justify-center"
							onClick={updateOrCreateRecipe}
						>
							Сохранить изменения
							{isLoading && (
								<span className="px-1">
									<Loading inline />
								</span>
							)}
						</Button>

						<Button
							className="w-full flex flex-row items-center justify-center"
							onClick={async () => {
								const result = await popupWindow(
									(closeWindow) => {
										return (
											<div className="flex flex-col items-center text-center">
												Вы уверены, что хотите удалить
												рецепт?
												<div className="flex flex-row items-center justify-center">
													<Button
														onClick={() =>
															closeWindow(
																undefined,
															)
														}
													>
														Нет
													</Button>
													<Button
														onClick={() =>
															closeWindow("yes")
														}
													>
														Да
													</Button>
												</div>
											</div>
										)
									},
								)

								if (!result) {
									return
								}

								const response = await recipe.delete()

								if (response instanceof ExError) {
									console.error(response)
									notificate("Произошла ошибка")
									return
								}
							}}
						>
							Удалить рецепт
							{isLoading && (
								<span className="px-1">
									<Loading inline />
								</span>
							)}
						</Button>
					</>
				) : (
					<Button
						className="w-full flex flex-row items-center justify-center"
						onClick={updateOrCreateRecipe}
					>
						Создать рецепт
						{isLoading && (
							<span className="px-1">
								<Loading inline />
							</span>
						)}
					</Button>
				)}
			</div>
		</div>
	)
}

export default RecipeChangeForm
