import { Item, Product, Recipe } from "@shared/facades"
import FoldableItem from "@shared/ui/FoldableItem"
import {
	CookingMethod,
	CookingMethods,
	Ingredient,
	Ingredients,
	translateCookingMethod,
	translateIngredient,
} from "@shared/model/types/enums"
import ImagePicker from "@shared/ui/ImagePicker"
import MultiSelect from "@shared/ui/MultiSelect"
import { Dispatch, ReactNode, SetStateAction, useState } from "react"
import { imageImage } from "@assets/ui"
import { ValidatedInput } from "@shared/ui/Inputs"
import { Button } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import {
	useDefaultWidgetWidth,
	useNotification,
	usePopupWindow,
} from "@shared/hooks"
import { ExError } from "@shared/helpers"
import { BaseErrorData, BaseFormData } from "../types"
import { agreeWindow } from "@shared/ui/PopupWindows"

interface ItemChangeFormBaseProps<
	T extends BaseFormData,
	N extends BaseErrorData,
> {
	item?: Item
	errorData: N
	setErrorData: Dispatch<SetStateAction<N>>
	formData: T
	setFormData: Dispatch<SetStateAction<T>>
	updateOrCreateItem: () => Promise<void>
	children?: ReactNode
	subjectNameOf: string
}

function ItemChangeFormBase<T extends BaseFormData, N extends BaseErrorData>({
	item,
	errorData,
	setErrorData,
	formData,
	setFormData,
	updateOrCreateItem,
	children,
	subjectNameOf,
}: ItemChangeFormBaseProps<T, N>) {
	const isChanging = item != undefined

	const popupWindow = usePopupWindow()
	const notificate = useNotification()
	const [isChangeLoading, setChangeLoading] = useState(false)
	const [isDeleteLoading, setDeleteLoading] = useState(false)

	const getImageLink = () => {
		if (item instanceof Recipe) {
			return (item as Recipe).imageLink
		} else if (item instanceof Product) {
			return (item as Product).imageLink
		}
	}

	const deleteItem = () => {
		if (item instanceof Recipe) {
			return (item as Recipe).delete()
		} else if (item instanceof Product) {
			return (item as Product).delete()
		}
	}

	const width = useDefaultWidgetWidth()

	async function updateOrCreateItemWrapper() {
		setChangeLoading(true)

		await updateOrCreateItem()

		setChangeLoading(false)
	}

	return (
		<div
			className="flex flex-col items-stretch p-4 bg-[var(--dark-color)] rounded-3xl my-4"
			style={{ width: `${width}vw` }}
		>
			<h1 className="text-xl sm:text-2xl text-center">
				{isChanging
					? `Изменение ${subjectNameOf} "${item.name}"`
					: `Создание ${subjectNameOf}`}
			</h1>

			<div className="self-center">
				<ImagePicker
					defaultUrl={isChanging ? getImageLink() : imageImage}
					error={errorData?.image}
					onChange={(image) => {
						setFormData({ ...formData, image })
						setErrorData((prev) => ({ ...prev, image: undefined }))
					}}
					onDelete={() =>
						setFormData({ ...formData, image: undefined })
					}
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
						setFormData({ ...formData, name: val })
						setErrorData((prev) => ({ ...prev, name: undefined }))
					}}
					value={item?.name}
				/>
			</div>

			<div className="p-4">
				<h2>Описание</h2>
				<ValidatedInput
					margin="0.5rem 0"
					width="100%"
					placeholder="Описание"
					onChange={(val) => setFormData({ ...formData, val })}
					value={item?.description}
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
							value={item?.itemInfo.pfc.protein.toString()}
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
								setFormData({ ...formData, protein: val })
								return ""
							}}
						/>
					</div>

					<div className="flex flex-row items-center">
						<p>Жиры:</p>
						<ValidatedInput
							error={errorData?.pfc?.fat}
							placeholder="Жиры"
							value={item?.itemInfo.pfc.fat.toString()}
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
								setFormData({ ...formData, fat: val })
								return ""
							}}
						/>
					</div>

					<div className="flex flex-row items-center">
						<p>Углеводы:</p>
						<ValidatedInput
							error={errorData?.pfc?.carbs}
							placeholder="Углеводы"
							value={item?.itemInfo.pfc.carbs.toString()}
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
								setFormData({ ...formData, carbs: val })
								return ""
							}}
						/>
					</div>

					<div className="flex flex-row items-center">
						<p>ККал:</p>
						<ValidatedInput
							error={errorData?.pfc?.kkal}
							placeholder="Кило калорий"
							value={item?.itemInfo.pfc.kkal.toString()}
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
								setFormData({ ...formData, kkal: val })
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
							selectedValues={formData.ingredients}
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
								setFormData({
									...formData,
									ingredients: formData.ingredients.concat(
										val as Ingredient,
									),
								})
							}
							onDelete={(val) =>
								setFormData({
									...formData,
									ingredients: formData.ingredients.filter(
										(ingredient) => ingredient != val,
									),
								})
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
							value={item?.itemInfo.mass.toString()}
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
								setFormData({ ...formData, mass: val })
								return ""
							}}
						/>
					</div>
					<div className="flex flex-col items-center self-stretch pb-4">
						<h2>Способы приготовления</h2>
						<MultiSelect
							selectedValues={formData.cookingMethods}
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
								setFormData({
									...formData,
									cookingMethods:
										formData.cookingMethods.concat(
											val as CookingMethod,
										),
								})
							}
							onDelete={(val) => {
								setFormData({
									...formData,
									cookingMethods:
										formData.cookingMethods.filter(
											(value) => value != val,
										),
								})
							}}
						/>
					</div>
				</FoldableItem>
			</div>
			{children}
			<div className="p-4 w-full">
				{isChanging ? (
					<>
						<Button
							className="w-full flex flex-row items-center justify-center"
							onClick={updateOrCreateItemWrapper}
						>
							Сохранить изменения
							{isChangeLoading && (
								<span className="px-1">
									<Loading inline />
								</span>
							)}
						</Button>

						<Button
							className="w-full flex flex-row items-center justify-center"
							onClick={async () => {
								const result = await popupWindow(
									agreeWindow(
										`Вы уверены, что хотите удалить ${subjectNameOf}?`,
									),
								)

								if (!result) {
									return
								}

								setDeleteLoading(true)

								const response = await deleteItem()

								if (response instanceof ExError) {
									console.error(response)
									notificate("Произошла ошибка")
									setDeleteLoading(false)
									return
								}

								setDeleteLoading(false)
							}}
						>
							Удалить рецепт
							{isDeleteLoading && (
								<span className="px-1">
									<Loading inline />
								</span>
							)}
						</Button>
					</>
				) : (
					<Button
						className="w-full flex flex-row items-center justify-center"
						onClick={updateOrCreateItemWrapper}
					>
						Создать рецепт
						{isChangeLoading && (
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

export default ItemChangeFormBase
