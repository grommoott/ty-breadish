import { Bakery, Maps } from "@shared/facades"
import { ExError } from "@shared/helpers"
import Loading from "@shared/ui/Loading"
import { FC, useEffect, useMemo, useState } from "react"
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useAppSelector, useMapWidth } from "@shared/hooks"
import { Icon } from "leaflet"
import {
	bakeryMarkerPng,
	mainColorMarkerPng,
	markerShadowPng,
} from "@assets/png"
import config from "../config"

interface PickUpOrderMapProps {
	onChange?: (bakery?: Bakery) => void
}

const PickUpOrderMap: FC<PickUpOrderMapProps> = ({ onChange = () => {} }) => {
	const { data: bakeriesSerialized } = useAppSelector(
		(state) => state.bakeries,
	)

	const bakeries = useMemo(
		() =>
			bakeriesSerialized
				?.map((bakery) => {
					const response = Bakery.parse(bakery)

					if (response instanceof ExError) {
						console.error(response)
						return
					}

					return response
				})
				.filter((val) => val != undefined),

		[bakeriesSerialized],
	)

	const [selectedBakery, setSelectedBakery] = useState<Bakery | undefined>(
		undefined,
	)
	const [center, setCenter] = useState<[number, number] | undefined>()

	useEffect(() => {
		const data = localStorage.getItem("mapCenterDefault")

		if (!data) {
			setCenter(config.mapDefaultCoords)
			return
		}

		try {
			const dataParsed = JSON.parse(data)
			setCenter(dataParsed)
		} catch (e) {
			setCenter(config.mapDefaultCoords)
		}
	}, [])

	useEffect(() => {
		onChange(selectedBakery)
	}, [selectedBakery])

	const width = useMapWidth()

	if (!bakeries || !center) {
		return (
			<div className="p-4 m-4 bg-[var(--dark-color)]">
				<Loading />
			</div>
		)
	}

	return (
		<div
			style={{
				width: `${width}vw`,
				height: "30rem",
			}}
			className="m-4 overflow-hidden rounded-3xl flex flex-col"
		>
			<MapContainer
				center={center}
				zoom={10}
				scrollWheelZoom={true}
				style={{ width: `100%`, height: "100%" }}
			>
				<TileLayer
					attribution={`\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e`}
					url={Maps.mapTileUrl("{x}", "{y}", "{z}")}
				/>

				{bakeries.map((bakery) => (
					<Marker
						icon={
							new Icon({
								iconUrl:
									selectedBakery?.id.id == bakery.id.id
										? mainColorMarkerPng
										: bakeryMarkerPng,
								iconSize: [40, 40],
								iconAnchor: [20, 50],
								shadowUrl: markerShadowPng,
								shadowSize: [40, 40],
								popupAnchor: [0, -50],
								className: "rounded-full",
							})
						}
						position={[
							bakery.coords.latitude,
							bakery.coords.longitude,
						]}
						key={bakery.id.id}
						draggable={true}
						eventHandlers={{
							click: () => {
								setSelectedBakery(bakery)
							},
						}}
					></Marker>
				))}
			</MapContainer>

			<div className="bg-[var(--dark-color)] p-4">
				{selectedBakery ? (
					<>
						<p>
							Выбранный пункт выдачи:{" "}
							<span className="text-[var(--main-color)]">
								{selectedBakery.address}
							</span>
						</p>
					</>
				) : (
					<p className="text-zinc-700">Пункт выдачи не выбран</p>
				)}
			</div>
		</div>
	)
}

export default PickUpOrderMap
