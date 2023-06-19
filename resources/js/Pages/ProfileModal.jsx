import React, { useContext, useRef, useState, useEffect } from 'react'
import {router, useForm, usePage } from '@inertiajs/react'
import MainLayout from './Layout/MainLayout'
import GlobalContext from '../context/GlobalContext'

const ProfileModal = ()=> {
	const url = useContext(GlobalContext).url
	const user = usePage().props.user
	const csrf = usePage().props.csrf
	const [friendList, setFriendList] = useState(usePage().props.friends)
	const [blockList, setBlockList] = useState(usePage().props.blocks)
	const header = useRef()
	const form = useRef()
	const friend = useRef()
	const block = useRef()
	const {data, setData, post, errors} = useForm({
		username: user.username,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		gender: user.gender,
	})

	const handleProfileSubmit = (e)=> {
		e.preventDefault()
		post('/user/profile-update')
	}

	const handleFriendStatus = (e, friend, type)=> {
		const str = e.currentTarget.value
		console.log(type)
		fetch(`${url}/user/update-friend-status`,{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-TOKEN': csrf
			},
			body: JSON.stringify({
				status: str,
				id: friend.id
			})
		})
		.then(res => {
			if(res.ok) {
				res.json().then(data => {
					if(type === 'friend') {
						setFriendList(prevState => prevState.map(state => {
							if(state.id === friend.id) state.status = data.status
							return state
						}))
					} else if(type === 'blockFriend'){
						setFriendList(prevState => prevState.filter(state => state.id !== friend.id))
						setBlockList(prevState => [
							...prevState,
							friend
						])
					} else {
						setBlockList(prevState => prevState.filter(state => state.id !== data.friendId))
					}
				})
			}
		})
	}

	useEffect(()=> console.log(friendList),[friendList])

	const handleTabButton = (e)=> {
		const str = e.currentTarget.value
		header.current.className = ''
		header.current.textContent = str
		header.current.classList.add(str.toLowerCase())
		form.current.classList.add('hidden')
		friend.current.classList.add('hidden')
		block.current.classList.add('hidden')

		if(str === 'Profile') form.current.classList.remove('hidden')
		else if(str === 'Friends') friend.current.classList.remove('hidden')
		else block.current.classList.remove('hidden')
	}

    return (
       <MainLayout>
            <div className="profile-container">
				<h1 ref={header} className='profile'>profile</h1>
                <div>
					<input type="button" value="Back" onClick={()=> router.get('/main')}/>
                    <input type="button" defaultValue={'Profile'} onClick={handleTabButton}/>
                    <input type="button" defaultValue={'Friends'} onClick={handleTabButton}/>
                    <input type="button" defaultValue={'Blocklist'} onClick={handleTabButton}/>
                    <input type="button" defaultValue={'Logout'} onClick={()=> router.get('/logout')}/>
                </div>
                <form ref={form} onSubmit={handleProfileSubmit}>
                    <input type="text" name="username" className='disabled' readOnly placeholder='Username' defaultValue={user.username} />
					{errors.firstName && <div className='invalid'>{errors.firstName}</div>}
                    <input type="text" name="firstName" placeholder='First name' value={data.firstName} onChange={(e)=> setData('firstName',e.currentTarget.value)}/>
					{errors.lastName && <div className='invalid'>{errors.lastName}</div>}
                    <input type="text" name="lastName" placeholder='Last name' value={data.lastName} onChange={(e)=> setData('lastName',e.currentTarget.value)}/>
					{errors.email && <div className='invalid'>{errors.email}</div>}
                    <input type="email" name="email" placeholder='Email' value={data.email} onChange={(e)=> setData('email',e.currentTarget.value)}/>
                    <input type="text" name="birthdate" className='disabled' readOnly placeholder='Birthdate' defaultValue={new Date(user.birthdate).toLocaleDateString('en-Us',{ year: 'numeric', month: 'long', day: 'numeric' })}/>
					{errors.gender && <div className='invalid'>{errors.gender}</div>}
                    <select name="gender" onChange={(e)=> setData('gender', e.currentTarget.value)} value={
						data.gender === 'male' ? 'male' 
						: data.gender === 'female' ? 'female'
						: 'other'
					}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Others</option>
                    </select>
                    <input type="submit" value="Save"/>
					<input type="button" defaultValue={'Change Password'}/>
                </form>

                <div ref={friend} className='friend hidden'>
					<table>
						<tbody>
							{
								friendList.map(friend => (
									<tr key={friend.conversationId}>
										<td>{friend.initial}</td>
										<td>
											<p>{friend.fullName}</p>
										</td>
										<td>
											<input type="button" defaultValue={
												friend.status === 'Friend'
												? 'Unfriend'
												: friend.status === 'Pending Request' || friend.status === 'Pending'
												? 'Pending'
												: friend.status === 'Add' 
												? 'Add'
												: 'Accept'
											} onClick={(e)=> handleFriendStatus(e, friend,'friend')}/>
											<input type="button" 
												defaultValue={friend.status === 'Pending Approved' ? 'Decline' : 'Block'} 
												onClick={(e)=> handleFriendStatus(e, friend,'blockFriend')}/>
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
                </div>
				<div ref={block} className='block hidden'>
					<table>
						<tbody>
							{
								blockList.map(block => (
									<tr key={`${block.conversationId}block`}>
										<td>{block.initial}</td>
										<td>
											<p>{block.fullName}</p>
										</td>
										<td>
											<input type="button" defaultValue={'Unblock'} onClick={(e)=> handleFriendStatus(e, block, 'block')}/>
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
                </div>
            </div>
	   </MainLayout>
    )
}

export default ProfileModal