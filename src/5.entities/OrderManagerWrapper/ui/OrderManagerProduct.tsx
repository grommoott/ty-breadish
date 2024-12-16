import { Product } from "@shared/facades"
import { NonStyledButton } from "@shared/ui/Buttons"
import { FC } from "react"
import { useNavigate } from "react-router-dom"

interface OrderManagerProductProps {
	product: Product
	count: number
}

const OrderManagerProduct: FC<OrderManagerProductProps> = ({
	product,
	count,
}) => {
	const navigate = useNavigate()

	return (
		<NonStyledButton
			className="flex flex-col md:flex-row items-center justify-around p-4 bg-zinc-900 rounded-3xl focus-visible-default w-full"
			onClick={() => navigate(`/products/id/${product.id}`)}
		>
			<img
				className="w-32"
				src={product.imageLink}
			/>

			<p
				draggable={false}
				className="select-none group-hover:scale-105 group-active:scale-95 duration-100 text-2xl text-center"
			>
				{product.name}
			</p>

			<p className="text-[var(--main-color)] group-hover:scale-105 group-active:scale-95 duration-100 text-2xl">
				x{count}
			</p>
		</NonStyledButton>
	)
}

export default OrderManagerProduct
