import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { router } from '@inertiajs/react'

const NewRoomModal = forwardRef(({friendList, setGroup}, ref)=> {
	const suggestInput = useRef() 
	const suggestList = useRef() 
	const groupInput = useRef() 
	const submit = useRef() 
	const [memberList, setMemberList] = useState([])
	const [suggestMember, setSuggestMember] = useState([
		{fullName: 'Tony Blake', conversationId: 1}
	])

	useEffect(()=> {
		console.log(memberList)
	},[memberList])

	const handleSubmit = (e)=> {
		e.preventDefault()
		const name = groupInput.current.value
		if(name.trim() !== '' && memberList.length === 0) return
		router.post('/user/create-group', {
			name, members: JSON.stringify(memberList)
		}, {
			preserveState: true,
			onStart: ()=> submit.current.disabled = true,
			onFinish: ()=> submit.current.disabled = false,
			onError: ()=> submit.current.disabled = false,
			onSuccess: (e)=> {
				console.log(e)
				setGroup(e.props.groups)
				reset()
				ref.current.classList.add('hidden')
			}
		})
	}

	const handleSearchNewMember = (e)=> {
		const str = suggestInput.current.value
		if(str.trim().length > 0) {
			const list = friendList.filter(friend => friend.fullName.toLowerCase().includes(str) || friend.username.toLowerCase().includes(str))
			setSuggestMember(list)
			suggestList.current.classList.add('show')
		} else {
			setSuggestMember([])
			suggestList.current.classList.remove('show')
		}
	}

	const reset = ()=> {
		setSuggestMember([])
		suggestInput.current.value = ''
		groupInput.current.value = ''
	}

    return (
        <div className="modal-container hidden" ref={ref} onClick={(e)=> {
					if(e.target === e.currentTarget) {
						reset()
						e.currentTarget.classList.add('hidden')
					}
				}}>
            <div className="modal group-modal">
                <h1>Create New Room</h1>
                <form onSubmit={handleSubmit}>
                    <input ref={groupInput} type="text" placeholder='Group Name'/>
                    <hr />
                    <div>
						<div>
							<input ref={suggestInput} type="text" placeholder={`Search a friend ...`} onChange={handleSearchNewMember}/>
							<ul ref={suggestList}>
								{
									suggestMember.map(member => (
										<li key={member.conversationId} onClick={()=> {
											const isPresent = memberList.some(mem => {
												return mem.fullName.toLowerCase() === member.fullName.toLowerCase() 
												|| mem.username.toLowerCase() === member.username.toLowerCase()
											})
											if(!isPresent) {
												setMemberList(prevState => [
													...prevState,
													member
												])
											}
											suggestInput.current.value = ''
											suggestList.current.classList.remove('show')
											setSuggestMember([])
										}}>{member.fullName}</li>
									))
								}
							</ul>
						</div>
                    </div>
                    <div>
                        <table>
                            <tbody>
                               {
								memberList.map(member => (
									<tr key={member?.conversationId} onClick={()=> {
										setMemberList(prevState => prevState.filter(mem => mem !== member))
									}}>
										<td>{member?.fullName}</td>
									</tr>
								))
								}
                            </tbody>
                        </table>
                    </div>
                    <input ref={submit} type="submit" value={'Create'} disabled={memberList.length == 0}/>
                </form>
            </div>
        </div>
    )
})

export default NewRoomModal
