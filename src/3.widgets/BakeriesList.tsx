import BakeryWrapper from "@entities/BakeryWrapper"
import CreateBakeryForm from "@entities/CreateBakeryForm"
import ChangeBakeryButton from "@features/ChangeBakeryButton"
import CreateBakeryButton from "@features/CreateBakeryButton"
import DeleteBakeryButton from "@features/DeleteBakeryButton"
import { Bakery } from "@shared/facades"
import { ExError } from "@shared/helpers"
import Loading from "@shared/ui/Loading"
import { FC, useEffect, useState } from "react"

const BakeriesList: FC = () => {
	const [bakeries, setBakeries] = useState<Array<Bakery>>()
	const [isLoading, setLoading] = useState(true)

	useEffect(() => {
		;(async () => {
			setLoading(true)
			const response = await Bakery.getList()

			if (response instanceof ExError) {
				console.error(response)
				return
			}

			setBakeries(response)
			setLoading(false)
		})()
	}, [])

	return (
		<div className="flex flex-col items-center w-full my-4">
			{isLoading ? (
				<div className="m-2 p-4 rounded-3xl bg-[var(--dark-color)]">
					<Loading />
				</div>
			) : (
				<>
					<CreateBakeryForm
						onCreate={(bakery) =>
							setBakeries((prev) => {
								const copy = prev?.filter(() => true)
								const tmp = new Array()
								tmp.push(bakery)
								return tmp.concat(copy)
							})
						}
						createBakeryButton={(
							getAddress,
							getCoords,
							setAddressError,
							setCoordsError,
							onCreate,
						) => (
							<CreateBakeryButton
								getAddress={getAddress}
								getCoords={getCoords}
								setAddressError={setAddressError}
								setCoordsError={setCoordsError}
								onCreate={onCreate}
							/>
						)}
					/>

					{bakeries?.map((bakery) => (
						<BakeryWrapper
							key={bakery.id.id}
							bakery={bakery}
							deleteBakeryButton={(bakery) => (
								<DeleteBakeryButton
									bakery={bakery}
									onDelete={(bak) =>
										setBakeries((prev) =>
											prev?.filter(
												(b) => b.id.id != bak.id.id,
											),
										)
									}
								/>
							)}
							changeBakeryButton={(
								bakery,
								getAddress,
								getCoords,
								setAddressError,
								setCoordsError,
								setEditing,
							) => (
								<ChangeBakeryButton
									bakery={bakery}
									getAddress={getAddress}
									getCoords={getCoords}
									setAddressError={setAddressError}
									setCoordsError={setCoordsError}
									setEditing={setEditing}
								/>
							)}
						/>
					))}
				</>
			)}
		</div>
	)
}

export default BakeriesList
