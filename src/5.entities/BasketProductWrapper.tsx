import { Product } from "@shared/facades"
import { useAppDispatch, useAppSelector } from "@shared/hooks"
import basketSlice from "@shared/store/slices/basketSlice"
import CountInput from "@shared/ui/Inputs/countInput"
import Loading from "@shared/ui/Loading"
import { FC, useMemo } from "react"

interface BasketProductWrapperProps {
	product?: Product
}

const BasketProductWrapper: FC<BasketProductWrapperProps> = ({ product }) => {
	if (!product) {
		return (
			<div className="p-2 m-2">
				{" "}
				<Loading />
			</div>
		)
	}

	const basket = useAppSelector((state) => state.basket)
	const dispatch = useAppDispatch()

	const count = useMemo(() => basket[product.id.id], [basket])

	const setCountInBasket = (count?: number) => {
		if (count == undefined) {
			return
		}

		if (count <= 0) {
			dispatch(basketSlice.actions.removeProduct(product.id.id))
			return
		}

		dispatch(
			basketSlice.actions.setProduct({ productId: product.id.id, count }),
		)
	}

	return (
		<div
			className="p-2 m-2 flex flex-col lg:flex-row justify-between items-center h-min bg-[var(--dark-color)] rounded-3xl"
			style={{ width: "50vw" }}
		>
			<img
				src={product.imageLink}
				className="w-32 hover:scale-110 active:scale-95 cursor-pointer duration-100"
			/>

			<p className="text-center hover:scale-[1.025] active:scale-[0.975] duration-100 cursor-pointer select-none">
				{product.name}
			</p>

			<CountInput
				initial={count}
				onChange={setCountInBasket}
			/>
		</div>
	)
}

export default BasketProductWrapper
