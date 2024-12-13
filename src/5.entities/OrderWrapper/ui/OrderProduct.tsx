import { Product } from "@shared/facades"
import { FC } from "react"
import { useNavigate } from "react-router-dom"

interface OrderProductProps {
	product: Product
	count: number
}

const OrderProduct: FC<OrderProductProps> = ({ product, count }) => {
	const navigate = useNavigate()

	return (
		<div
			className="flex flex-col md:flex-row items-center m-2 p-4 rounded-3xl justify-around w-full bg-zinc-900 group cursor-pointer"
			onClick={() => navigate(`/products/id/${product.id}`)}
		>
			<img
				src={product.imageLink}
				className="w-32 group-hover:scale-105 group-active:scale-95 duration-100"
			/>

			<p
				draggable={false}
				className="select-none group-hover:scale-105 group-active:scale-95 duration-100 text-2xl"
			>
				{product.name}
			</p>

			<p className="text-[var(--main-color)] group-hover:scale-105 group-active:scale-95 duration-100 text-2xl">
				x{count}
			</p>
		</div>
	)
}

export default OrderProduct
