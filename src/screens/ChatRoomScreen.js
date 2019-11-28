import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Header, Left, Body, Right, Thumbnail } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { GiftedChat } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

const ChatRoomScreen = props => {
	const friendId = props.navigation.getParam('id')
	const [friendData, setFriendData] = useState({})
	const [userId, setUserId] = useState('')
	const [userAvatar, setUserAvatar] = useState()
	const [messages, setMessages] = useState([])

	const onSend = useCallback(async text => {
		text[0].userId = text[0].user._id
		text[0].user.avatar = userAvatar
		setMessages(prev => [...text, ...prev])
		await firestore()
			.collection('messages')
			.doc(text[0].user._id.toString())
			.collection(friendId)
			.add(text[0])
		await firestore()
			.collection('messages')
			.doc(friendId)
			.collection(text[0].user._id.toString())
			.add(text[0])
	}, [])

	const getUserId = async () => {
		const data = await auth().currentUser
		setUserId(data.uid)
	}

	const getUserData = async () => {
		await auth().onAuthStateChanged(user => {
			firestore()
				.collection('users')
				.doc(user.uid)
				.onSnapshot(user => {
					const data = user.data()
					setUserAvatar(data.avatar)
				})
		})
	}

	const getMessages = async () => {
		await auth().onAuthStateChanged(user => {
			firestore()
				.collection('messages')
				.doc(user.uid)
				.collection(friendId)
				.orderBy('createdAt', 'desc')
				.onSnapshot(query => {
					const chats = []
					query.docs.map(i => chats.push(i._data))
					setMessages(chats)
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

	useEffect(() => {
		getUserId()
		getUserData()
		getMessages()
		getFriendData()
	}, [])

	return (
		<>
			<Header style={style.header}>
				<Left>
					<TouchableOpacity
						onPress={() =>
							props.navigation.navigate('BottomTabNavigator')
						}>
						<Icon name="arrow-left-thick" size={25} color="#FFF" />
					</TouchableOpacity>
				</Left>
				<Body>
					<Text style={style.headerTitle}>{friendData.name}</Text>
				</Body>
				<Right>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<TouchableOpacity
							onPress={() =>
								props.navigation.navigate('MapScreen', {
									id: friendId,
								})
							}>
							<Icon
								name="google-maps"
								size={25}
								color="#FFF"
								style={{ paddingHorizontal: 10 }}
							/>
						</TouchableOpacity>
						<Thumbnail
							source={{ uri: friendData.avatar }}
							style={{
								width: 30,
								height: 30,
							}}
						/>
					</View>
				</Right>
			</Header>
			<GiftedChat
				messages={messages}
				onSend={messages => onSend(messages)}
				user={{
					_id: userId,
				}}
			/>
		</>
	)
}

const style = {
	header: {
		backgroundColor: '#35ABFF',
		height: 'auto',
		paddingBottom: 7,
		paddingTop: 7,
	},
	headerTitle: {
		color: '#FFF',
		fontSize: 18,
		fontWeight: 'bold',
	},
}

export default ChatRoomScreen
