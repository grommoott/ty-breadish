import { AvgRate, ItemId, ItemInfo, Price, ProductId } from "@shared/model/types/primitives";
import { Item } from "./item";
import { IListProduct, IProduct } from "@shared/model/interfaces";
import { ExError } from "@shared/helpers";
import { createProduct, createProductImage, deleteProduct, deleteProductImage, getProduct, getProductsList, putProduct, putProductImage } from "@shared/api/products";
import { backendBaseUrl } from "@shared/config";

class Product extends Item {

    // Private fields

    private _id: ProductId
    private _price: Price

    // Getters

    public get id(): ProductId {
        return this._id
    }

    public get price(): Price {
        return this._price
    }

    public get imageLink(): string {
        return `${backendBaseUrl}/api/products/images/id/${this.id}`
    }

    // Methods

    public async edit(price?: Price, name?: string, description?: string, itemInfo?: ItemInfo, image?: File): Promise<void | ExError> {
        const edit: void | ExError = await putProduct(this.id, price, name, description, itemInfo)

        if (edit instanceof ExError) {
            return edit
        }

        if (image) {
            const putImage: void | ExError = await putProductImage(this.id, image)

            if (putImage instanceof ExError) {
                return putImage
            }
        }

        if (price) {
            this._price = price
        }

        super._edit(name, description, itemInfo)
    }

    public async delete(): Promise<void | ExError> {
        const del: void | ExError = await deleteProduct(this.id)

        if (del instanceof ExError) {
            return del
        }

        const deleteImage: void | ExError = await deleteProductImage(this.id)

        if (deleteImage instanceof ExError) {
            return deleteImage
        }
    }

    // Static constructors

    public static async fromId(id: ProductId): Promise<Product | ExError> {
        const product: IProduct | ExError = await getProduct(id)

        if (product instanceof ExError) {
            return product
        }

        return new Product(product)
    }

    public static async create(price: Price, name: string, description: string, itemInfo: ItemInfo, image: File): Promise<Product | ExError> {
        const product: IProduct | ExError = await createProduct(price, name, description, itemInfo)

        if (product instanceof ExError) {
            return product
        }

        const createImage: void | ExError = await createProductImage(product.id, image)

        if (createImage instanceof ExError) {
            return createImage
        }

        return new Product(product)
    }

    // Constructor

    private constructor({ id, price, itemId, name, description, avgRate, itemInfo }: IProduct) {
        super({ itemId, name, description, avgRate, itemInfo })

        this._id = id
        this._price = price
    }
}

class ListProduct {

    // Private fields

    private _listProduct: IListProduct

    // Getters

    public get id(): ProductId {
        return this._listProduct.id
    }

    public get price(): Price {
        return this._listProduct.price
    }

    public get itemId(): ItemId {
        return this._listProduct.itemId
    }

    public get name(): string {
        return this._listProduct.name
    }

    public get avgRate(): AvgRate {
        return this._listProduct.avgRate
    }

    public get itemInfo(): ItemInfo {
        return this._listProduct.itemInfo
    }

    public get imageLink(): string {
        return `${backendBaseUrl}/api/products/images/id/${this.id}`
    }

    // Static constructors

    public static async getProductsList(): Promise<Array<ListProduct> | ExError> {
        const products: Array<IListProduct> | ExError = await getProductsList()

        if (products instanceof ExError) {
            return products
        }

        return products.map(product => new ListProduct(product))
    }

    // Constructor

    private constructor({ id, price, itemId, name, avgRate, itemInfo }: IListProduct) {
        this._listProduct = { id, price, itemId, name, avgRate, itemInfo }
    }
}

export { Product, ListProduct }
