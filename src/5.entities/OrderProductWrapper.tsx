import { Product } from "@shared/facades"
import Loading from "@shared/ui/Loading"
import { FC } from "react"

interface OrderProductWrapperProps {
	product?: Product
	count: number
}

const OrderProductWrapper: FC<OrderProductWrapperProps> = ({
	product,
	count,
}) => {
	if (!product) {
		return (
			<div className="p-2 m-2">
				<Loading />
			</div>
		)
	}

	return (
		<div className="m-2 p-2 bg-[var(--dark-color)] rounded-3xl w-[40vw] flex flex-col lg:flex-row items-center justify-between px-4">
			<img
				src={product.imageLink}
				className="w-32 hover:scale-110 active:scale-95 cursor-pointer duration-100"
			/>

			<div className="flex flex-col sm:flex-row items-center gap-4">
				<p className="text-center hover:scale-[1.025] active:scale-[0.975] duration-100 cursor-pointer select-none">
					{product.name}
				</p>

				<div className="flex flex-row items-center gap-1">
					<p className="text-zinc-700">x</p>
					<p className="text-[var(--main-color)]">{count}</p>
				</div>
			</div>
		</div>
	)
}

export default OrderProductWrapper
