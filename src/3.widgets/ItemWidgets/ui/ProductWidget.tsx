import { Product } from "@shared/facades"
import { FC } from "react"
import ItemWidgetBase from "./ItemWidgetBase"
import ProductWrapper from "@entities/ProductWrapper"
import FeaturedButton from "@features/FeaturedButton"

interface ProductWidgetProps {
	product?: Product
}

const ProductWidget: FC<ProductWidgetProps> = ({ product }) => {
	return (
		<ItemWidgetBase<Product>
			item={product}
			itemWrapper={(item) => (
				<ProductWrapper
					product={item}
					featuredButton={(itemId, itemType) => (
						<FeaturedButton
							itemId={itemId}
							itemType={itemType}
						/>
					)}
				/>
			)}
		/>
	)
}

export { ProductWidget }
