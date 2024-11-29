import {
	bakeryMarkerPng,
	mainColorMarkerPng,
	markerShadowPng,
} from "@assets/png"
import { Bakery, Maps } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { useAppSelector } from "@shared/hooks"
import { BakeryId, Coords } from "@shared/model/types/primitives"
import Loading from "@shared/ui/Loading"
import { Icon, Marker as MarkerLeaflet } from "leaflet"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import config from "../config"

interface CourierOrderMapProps {
	onChange?: (coords?: Coords, bakeryId?: BakeryId) => void
}

const CourierOrderMap: FC<CourierOrderMapProps> = ({ onChange = () => {} }) => {
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

	const [center, setCenter] = useState<[number, number] | undefined>()

	const [selectedCoords, setSelectedCoords] = useState<Coords | undefined>()

	const selectionMarkerRef = useRef(null)

	useEffect(() => {
		const data = localStorage.getItem("mapCenterDefault")

		if (!data) {
			setCenter(config.mapDefaultCoords)
			setSelectedCoords(new Coords(...config.mapDefaultCoords))
			return
		}

		try {
			const dataParsed = JSON.parse(data)
			setCenter(dataParsed)
			setSelectedCoords(Coords.fromObject(dataParsed))
		} catch (e) {
			setCenter(config.mapDefaultCoords)
			setSelectedCoords(new Coords(...config.mapDefaultCoords))
		}
	}, [])

	useEffect(() => {
		if (!selectedCoords) {
			return
		}

		localStorage.setItem(
			"mapCenterDefault",
			JSON.stringify(selectedCoords?.toNormalView()),
		)

		let nearestBakeryId = undefined
		let nearestBakeryDistance = Infinity

		const normalizedCoords = new Coords(
			((selectedCoords.latitude - 180) % 360) + 180,
			((selectedCoords.longitude - 180) % 360) + 180,
		)

		bakeries?.forEach((bakery) => {
			const distance =
				(Math.pow(
					bakery.coords.latitude - normalizedCoords.latitude,
					2,
				) +
					Math.pow(
						bakery.coords.latitude - normalizedCoords.longitude,
						2,
					)) *
				(90 - Math.abs(bakery.coords.latitude)) // aproximate

			if (distance < nearestBakeryDistance) {
				nearestBakeryId = bakery.id
				nearestBakeryDistance = distance
			}
		})

		onChange(selectedCoords, nearestBakeryId)
	}, [selectedCoords])

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
								iconUrl: bakeryMarkerPng,
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
					></Marker>
				))}

				{selectedCoords && (
					<Marker
						icon={
							new Icon({
								iconUrl: mainColorMarkerPng,
								iconSize: [40, 40],
								iconAnchor: [20, 50],
								shadowUrl: markerShadowPng,
								shadowSize: [40, 40],
								popupAnchor: [0, -50],
								className: "rounded-full",
							})
						}
						position={[
							selectedCoords.latitude,
							selectedCoords.longitude,
						]}
						ref={selectionMarkerRef}
						draggable={true}
						eventHandlers={{
							dragend() {
								if (!selectionMarkerRef.current) {
									return
								}

								const selectionMarker =
									selectionMarkerRef.current as MarkerLeaflet

								const coords = selectionMarker.getLatLng()
								setSelectedCoords(
									Coords.fromObject([coords.lat, coords.lng]),
								)
							},
						}}
					/>
				)}
			</MapContainer>
		</div>
	)
}

export default CourierOrderMap
