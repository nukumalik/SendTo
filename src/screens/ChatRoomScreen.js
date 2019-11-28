import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Button, Header, Left, Body, Right, Thumbnail } from 'native-base'
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
		text[0].user.avatar = userAvatar
		console.log(text)
		setMessages(prev => [...text, ...prev])
		await firestore()
			.doc('messages/' + userId)
			.collection(friendId.toString())
			.add(text[0])
		await firestore()
			.doc('messages/' + friendId)
			.collection(userId)
			.add(text[0])
	}, [])

	const getUserData = async () => {
		await auth().onAuthStateChanged(user => {
			setUserId(user.uid)
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
		getUserData()
		getMessages()
		getFriendData()
	}, [])

	return (
		<>
			<Header style={style.header}>
				<Left>
					<TouchableOpacity onPress={() => props.navigation.goBack()}>
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
		paddingTop: 7,
		paddingBottom: 7,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#FFF',
	},
}

export default ChatRoomScreen
