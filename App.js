import React, { useState, useEffect } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import Geolocation from 'react-native-geolocation-service'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import AppContainer from './src/AppContainer'

const App = () => {
	const [latitude, setLatitude] = useState()
	const [longitude, setLongitude] = useState()

	const getGeo = async () => {
		await Geolocation.watchPosition(
			position => {
				if (!position.coords.latitude && !position.coords.longitude) {
					return
				} else {
					setLongitude(position.coords.longitude)
					setLatitude(position.coords.latitude)
				}
			},
			error => {
				console.log(error)
			},
			{
				fastestInterval: 5000,
			},
		)
	}

	setInterval(() => {
		getGeo()
		if (latitude && longitude) {
			auth().onAuthStateChanged(user => {
				firestore()
					.collection('locations')
					.doc(user.uid)
					.set({ latitude, longitude })
			})
			// console.log(latitude, longitude)
		}
	}, 10000)

	return <AppContainer />
}

export default App
