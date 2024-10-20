import { Product } from "@shared/facades"
import { FC, useState } from "react"
import ItemChangeFormBase from "./ItemChangeFormBase"
import { BaseErrorData, BaseFormData } from "../types"
import { CookingMethod, Ingredient } from "@shared/model/types/enums"
import { ValidatedInput } from "@shared/ui/Inputs"
import { ItemInfo, Price } from "@shared/model/types/primitives"
import { ExError } from "@shared/helpers"
import { useNotification } from "@shared/hooks"

interface ProductChangeFormProps {
	product?: Product
}

type ErrorData = BaseErrorData & {
	price?: string
}
type FormData = BaseFormData & {
	price: string
}

const ProductChangeForm: FC<ProductChangeFormProps> = ({ product }) => {
	const isChanging = product != undefined

	const notificate = useNotification()

	const [formData, setFormData] = useState<FormData>({
		name: product?.name || "",
		description: product?.description || "",
		carbs: product?.itemInfo.pfc.carbs.toString() || "",
		protein: product?.itemInfo.pfc.protein.toString() || "",
		fat: product?.itemInfo.pfc.fat.toString() || "",
		kkal: product?.itemInfo.pfc.kkal.toString() || "",
		mass: product?.itemInfo.mass.toString() || "",
		cookingMethods:
			product?.itemInfo.cookingMethod || new Array<CookingMethod>(),
		ingredients: product?.itemInfo.ingredients || new Array<Ingredient>(),
		price: product?.price.toString() || "",
	})
	const [errorData, setErrorData] = useState<ErrorData>({})

	const updateOrCreateProduct = async () => {
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
				"Для создания продукта необходимо выбрать изображение для него"
			error = true
		}

		if (formData.price == "") {
			errorData.price = "Цена должна быть определена"
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
			const product_ = await Product.fromId(product.id)

			if (product_ instanceof ExError) {
				console.error(product_)
				return
			}

			const response = await product_.edit(
				new Price(parseFloat(formData.price)),
				formData.name,
				formData.description,
				itemInfo,
				formData.image,
			)

			if (response instanceof ExError) {
				console.error(response)
				notificate("Произошла ошибка")
				return
			}

			notificate("Продукт успешно изменён")
		} else {
			if (!formData.image) {
				return
			}

			const response = await Product.create(
				new Price(parseFloat(formData.price)),
				formData.name,
				formData.description,
				itemInfo,
				formData.image,
			)

			if (response instanceof ExError) {
				console.error(response)
				notificate("Произошла ошибка")
				return
			}
		}
	}

	return (
		<ItemChangeFormBase
			subjectNameOf="продукта"
			item={product}
			updateOrCreateItem={updateOrCreateProduct}
			errorData={errorData}
			setErrorData={setErrorData}
			formData={formData}
			setFormData={setFormData}
		>
			<div className="p-4">
				<h2>Цена</h2>

				<ValidatedInput
					error={errorData?.price}
					placeholder="Цена в рублях"
					value={product?.itemInfo.pfc.protein.toString()}
					onChange={() =>
						setErrorData((prev) => ({
							...prev,
							price: undefined,
						}))
					}
					validator={(val) => {
						if (!Number(val)) {
							return "Это поле принимает только числовые значения с десятичным разделителем в виде точки, например: 42.4"
						}
						setFormData({ ...formData, price: val })
						return ""
					}}
				/>
			</div>
		</ItemChangeFormBase>
	)
}

export { ProductChangeForm }
