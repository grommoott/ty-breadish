import { Product } from "@shared/facades"
import { FC } from "react"
import ItemWidgetBase from "./ItemWidgetBase"
import ProductWrapper from "@entities/ProductWrapper"

interface ProductWidgetProps {
	product?: Product
}

const ProductWidget: FC<ProductWidgetProps> = ({ product }) => {
	return (
		<ItemWidgetBase<Product>
			item={product}
			itemWrapper={(item) => <ProductWrapper product={item} />}
		/>
	)
}

export { ProductWidget }
