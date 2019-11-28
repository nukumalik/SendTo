import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList } from 'react-native'
import { Header, Left, Body, Right, Button, Thumbnail } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import firestore from '@react-native-firebase/firestore'
import { TouchableOpacity } from 'react-native-gesture-handler'

const UserList = props => {
	const [search, setSearch] = useState('')
	const [isSearch, setIsSearch] = useState(false)
	const [users, setUsers] = useState()
	const [isAsc, setIsAsc] = useState(true)

	const searchToggle = () => {
		if (isSearch) {
			setIsSearch(false)
		} else {
			setIsSearch(true)
		}
	}

	const userList = async () => {
		await firestore()
			.collection('users')
			.orderBy('name', isAsc ? 'asc' : 'desc')
			.limit(50)
			.onSnapshot(querySnapshot => {
				setUsers(querySnapshot.docs)
			})
	}

	const findUser = async () => {
		await firestore()
			.collection('users')
			.orderBy('name', isAsc ? 'asc' : 'desc')
			.where('name', '>=', search)
			.onSnapshot(querySnapshot => {
				setUsers(querySnapshot.docs)
			})
	}

	if (search.length > 2) {
		findUser()
	} else if (search.length < 1) {
		userList()
	}

	useEffect(() => {
		userList()
	}, [])

	return (
		<>
			<Header style={style.header}>
				<Left>
					<Button transparent onPress={() => searchToggle()}>
						<Icon name="magnify" size={25} color="#35ABFF" />
					</Button>
				</Left>
				<Body>
					<Text style={style.headerTitle}>Add Friend</Text>
				</Body>
				<Right>
					<Button
						transparent
						onPress={() =>
							isAsc ? setIsAsc(false) : setIsAsc(true)
						}>
						<Icon
							name={isAsc ? 'sort-descending' : 'sort-ascending'}
							size={25}
							color="#35ABFF"
						/>
					</Button>
				</Right>
			</Header>
			{isSearch && (
				<View style={style.searchWrapper}>
					<TextInput
						onChangeText={text => setSearch(text)}
						style={style.search}
						placeholder="Search..."
						autoFocus
					/>
				</View>
			)}
			<FlatList
				data={users}
				renderItem={({ item }) => (
					<>
						<TouchableOpacity
							onPress={() =>
								props.navigation.navigate('UserProfileScreen', {
									id: item._data.id,
								})
							}>
							<View style={style.listWrapper}>
								<View style={style.listLeft}>
									<Thumbnail
										source={{ uri: item._data.avatar }}
									/>
								</View>
								<View style={style.listBody}>
									<Text style={style.listTitle}>
										{item._data.name}
									</Text>
									<Text style={style.listMeta}>
										@{item._data.username}
									</Text>
								</View>
								<View style={style.listRight}>
									<Button transparent>
										<Icon
											name="plus"
											size={25}
											color="#35ABFF"
										/>
									</Button>
								</View>
							</View>
						</TouchableOpacity>
					</>
				)}
				keyExtractor={(item, index) => index.toString()}
			/>
		</>
	)
}

const style = {
	header: {
		backgroundColor: '#FFF',
		elevation: 0,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#35ABFF',
	},
	searchWrapper: {
		// marginHorizontal: 'auto',
		// backgroundColor: '#eee',
		// borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	search: {
		padding: 10,
		width: '90%',
		backgroundColor: '#eee',
		borderRadius: 5,
	},

	// List
	listWrapper: {
		backgroundColor: '#FFF',
		padding: 5,
		marginHorizontal: 10,
		display: 'flex',
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	listLeft: {
		padding: 10,
		width: 'auto',
	},
	listBody: {
		padding: 10,
		justifyContent: 'center',
	},
	listRight: {
		width: 'auto',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 'auto',
	},
	listTitle: {
		fontSize: 15,
		fontWeight: 'bold',
		paddingBottom: 5,
	},
	listMeta: {
		fontSize: 12,
		color: 'gray',
	},
}

export default UserList
