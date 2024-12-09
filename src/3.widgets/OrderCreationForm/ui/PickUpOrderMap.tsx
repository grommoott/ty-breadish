import { Bakery, Maps } from "@shared/facades"
import { ExError } from "@shared/helpers"
import Loading from "@shared/ui/Loading"
import { FC, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import leaflet from "leaflet"
import { useAppSelector } from "@shared/hooks"
import { Icon } from "leaflet"
import {
	bakeryMarkerPng,
	mainColorMarkerPng,
	markerShadowPng,
} from "@assets/png"
import config from "../config"

// import "leaflet/dist/leaflet.css" isn't working
leaflet

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

	useLayoutEffect(() => {
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
				height: "30rem",
			}}
			className="m-4 overflow-hidden rounded-3xl flex flex-col w-full"
		>
			<MapContainer
				center={center}
				zoom={10}
				scrollWheelZoom={true}
				className="w-full h-full"
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

			<div className="bg-zinc-900 p-4">
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
