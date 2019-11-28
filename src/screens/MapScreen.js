import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native'
import { Header, Left, Body, Right, Button } from 'native-base'
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import MapViewDirections from 'react-native-maps-directions'

const MapScreen = props => {
	const friendId = props.navigation.getParam('id')
	const [friendData, setFriendData] = useState({})
	const [friendLatitude, setFriendLatitude] = useState()
	const [friendLongitude, setFriendLongitude] = useState()
	const [userData, setUserData] = useState({})
	const [userLatitude, setUserLatitude] = useState()
	const [userLongitude, setUserLongitude] = useState()
	const [isLoading, setIsLoading] = useState(true)

	const getFriendLocation = async () => {
		const documentSnapshot = await firestore()
			.collection('locations')
			.doc(friendId)
			.get()
		const data = documentSnapshot.data()
		setFriendLatitude(data.latitude)
		setFriendLongitude(data.longitude)
		setIsLoading(false)
	}

	const getUserLocation = async () => {
		await auth().onAuthStateChanged(user => {
			firestore()
				.collection('locations')
				.doc(user.uid)
				.onSnapshot(query => {
					const data = query.data()
					setUserLatitude(data.latitude)
					setUserLongitude(data.longitude)
				})
		})
	}

	const getFriendData = async () => {
		const documentSnapshot = await firestore()
			.collection('users')
			.doc(friendId)
			.get()
		const data = documentSnapshot.data()
		setFriendData(data)
	}

	const getUserData = async () => {
		await auth().onAuthStateChanged(user => {
			firestore()
				.collection('users')
				.doc(user.uid)
				.onSnapshot(query => {
					const data = query.data()
					setUserData(data)
				})
		})
	}

	const cordinates = [
		{
			latitude: userLatitude,
			longitude: userLongitude,
		},
		{
			latitude: friendLatitude,
			longitude: friendLongitude,
		},
	]

	useState(() => {
		getFriendData()
		getFriendLocation()
		getUserData()
		getUserLocation()
	}, [])

	return (
		<>
			<Header style={style.header}>
				<Left>
					<Button
						transparent
						onPress={() => props.navigation.goBack()}>
						<Icon name="arrow-left-thick" size={25} color="#FFF" />
					</Button>
				</Left>
				<Body>
					<Text style={style.headerTitle}>Location</Text>
				</Body>
				<Right></Right>
			</Header>
			<View style={style.wrapper}>
				{isLoading && (
					<ActivityIndicator size="large" color="#35ABFF" />
				)}
				{!isLoading && (
					<MapView
						style={style.map}
						provider={PROVIDER_GOOGLE}
						region={{
							latitude: userLatitude,
							longitude: userLongitude,
							latitudeDelta: 0.015,
							longitudeDelta: 0.0121,
						}}>
						<Marker
							coordinate={cordinates[0]}
							title={userData.name}
							description={'My Location'}
						/>
						<Marker
							coordinate={cordinates[1]}
							title={friendData.name}
							description={'Friend Location'}
						/>
						<Polyline
							coordinates={cordinates}
							geodesic={true}
							strokeWidth={2}
							strokeColor="hotpink"
						/>
						{/* <MapViewDirections
							origin={cordinates[0]}
							destination={cordinates[1]}
							apikey="AIzaSyABlBVElYH-1b9iVNKHjFj5jrOy6L5Q9qA"
							strokeWidth={2}
							strokeColor="hotpink"
						/> */}
					</MapView>
				)}
			</View>
		</>
	)
}

const style = StyleSheet.create({
	wrapper: {
		flex: 1,
		// ...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
	},
	map: {
		// ...StyleSheet.absoluteFillObject,
		width: '100%',
		height: '100%',
	},
	header: {
		backgroundColor: '#35ABFF',
		elevation: 0,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#FFF',
	},
})

export default MapScreen
