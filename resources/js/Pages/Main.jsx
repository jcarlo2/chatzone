import React, {useContext, useEffect, useRef, useState} from 'react'
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import Echo from "laravel-echo"
import Pusher from 'pusher-js'
import {useForm, usePage, router} from "@inertiajs/react";
import MainLayout from "./Layout/MainLayout.jsx";
import ConnectModal from "../components/ConnectModal.jsx";
import NewRoomModal from "../components/NewRoomModal.jsx";
import GlobalContext from "../context/GlobalContext.jsx";

const Main = ()=> {
  const url = useContext(GlobalContext).url
  const csrf = usePage().props.csrf
  const {id, username, firstName, lastName} = usePage().props.user
  const [friendList, setFriendList] = useState(usePage().props.friends)
  const [blockList, setBlockList] = useState(usePage().props.blocks)
  const [groupList, setGroupList] = useState(usePage().props.groups)
  const [activeChat, setActiveChat] = useState({
    fullName: '',
    username: '',
    conversationId: '',
    type: ''
  })
  const [searchSuggestionList, setSearchSuggestionList] = useState([])
  const [contentList, setContentList] = useState([])
  const [messageLoadURL, setMessageLoadURL] = useState(null)
  const [doScroll, setDoScroll] = useState(false)
  const emoji = useRef()
  const messageBox = useRef()
  const messageList = useRef()
  const float = useRef()
  const connectModal = useRef()
  const newGroupModal = useRef()
  const profileModal = useRef()
  const searchList = useRef()
  const search = useRef()
  const {data, setData, processing} = useForm({
    message: '',
    channel: -99,
    username: ''
  })

  useEffect(()=> {handleSearchSuggestion()},[friendList, groupList])

  useEffect(()=> {
    if(searchSuggestionList.length > 0) searchList.current.classList.add('show')
    else searchList.current.classList.remove('show')
  }, [searchSuggestionList])

  useEffect(()=> {
    findAllMessages()
    setData(previousData => ({
     ...previousData,
        'username': activeChat.username,
        'channel': activeChat.conversationId
    }))
  },[activeChat])

  useEffect(()=> {
    if(doScroll || messageList.current.scrollTop === messageList.current.scrollHeight) {
      setDoScroll(false)
      messageList.current.scrollTop = messageList.current.scrollHeight
      return
    } 
    messageList.current.scrollTop = 200
  }, [contentList])


  useEffect(()=> {
    const echo = new Echo({
      broadcaster: 'pusher',
      key: 'live_play_key',
      wsHost: 'localhost',
      cluster: 'mt1',
      wsPort: 6001, // or the configured WebSocket port
      wssPort: 6001, // or the configured secure WebSocket port
      forceTLS: false, // change to true if using SSL
      disableStats: true, // optional, to disable stats
    })

    echo.connector.pusher.connection.bind('connected', () => {
      console.log('WebSocket connection established');
      friendList.forEach(friend => handleMakingChannel(friend,echo,'friend'))
      groupList.forEach(group => handleMakingChannel(group, echo,'group'))
    });

    return ()=> {
      friendList.forEach(friend => {
        echo.channel(friend.conversationId.toString()).unsubscribe()
      })
      echo.disconnect()
    }
  },[friendList.length, activeChat])

  const handleSearchSuggestion = ()=> {
    const str = search.current.value.toLowerCase()
    const list = str.trim() === '' ? [] : [...friendList, ...groupList]
      .filter(item => item.fullName.toLowerCase().includes(str))
    setSearchSuggestionList(list)
  }

  const handleMakingChannel = (entity, echo, type)=> {
    const channel = echo.join(`presence.play.${entity.conversationId}`)
      .here((event)=> handleUserTyping(channel, entity.conversationId))
      .listen('.play-event',(event)=> {
        setDoScroll(true)
        handleListenEvent(event, type)
        // make a dialog for new message, when clicked, scroll to bottom
        // messageList.current.scrollTop = messageList.current.scrollHeight;
      })
      .listenForWhisper('typing',()=> {
        if(entity.conversationId === activeChat.conversationId) {
          float.current.classList.add('show')
        }
      })
      .listenForWhisper('stop-typing',()=> {
        if(entity.conversationId === activeChat.conversationId) {
          float.current.classList.remove('show')
        }
      })
  }

  const handleListenEvent = (event,type)=> {
    handleChangeLastMessages(event,type)
    if(activeChat.conversationId !== event.channel) return
    messageBox.current.value = ''
    setData(previousData => ({
      ...previousData,
      message: ''
    }))
    handleContentList(event)
  }

  const handleUserTyping = (channel,conversationId)=> {
    messageBox.current.addEventListener('focus',()=> {
      if(activeChat.conversationId !== conversationId) return
      channel.whisper('typing',{
        fullName: username,
        isGroup: 'false'
      })
    })
    messageBox.current.addEventListener('blur',()=> {
      channel.whisper('stop-typing',{})
    })
  }

  const handleChangeLastMessages = (event, type)=> {
    if(type === 'friend') {
      setFriendList(prevState => prevState.map(friend => {
        if (friend.conversationId === event.channel) {
          return {
            ...friend,
            lastMessage: event.content,
            isLastSender: username === event.sender
          }
        }
        return friend
      }))
    }else {
      setGroupList(prevState => prevState.map(group => {
        if(group.conversationId === event.channel) {
          console.log(group)
          return {
            ...group,
            lastMessage: event.content,
            isLastSender: username === event.sender
          }
        }
        return group
      }))
    }
  }

  const handleContentList = ({content, sender, initial, fullName, id})=> {
    setContentList(prevState => [
      ...prevState,
      {
        content,initial,fullName,id,
        username: sender
      }
    ])
  }

  const findAllMessages = () => {
    fetch(`${url}/api/user/find-all-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversationId: activeChat.conversationId
      })
    }).then(res => {
      if(res.ok) {
        res.json().then(({url,list}) => {
          setContentList(list)
          setMessageLoadURL(url.next_page_url)
        })
      }
    }).catch(console.log)
  }

  const handleMessageListScroll = (e)=> {
    if(!messageLoadURL) return
    if(e.currentTarget.scrollTop === 0) {
      fetch(messageLoadURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId: activeChat.conversationId
        })
      }).then(res => {
        if(res.ok) {
          res.json().then(({url,list}) => {
            setMessageLoadURL(url.next_page_url)
            setContentList(prevState => ([
              ...list,
              ...prevState
            ]))
          })
        }
      }).catch(console.log)
    }
  }

  const sendMessage = ()=> {
    if(data.message !== undefined && data.message.trim() !== '' && data.channel >= 0) {
      fetch(`${url}/event`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf
        },
        body: JSON.stringify(data)
      }).then(res => {
          if(res.ok) {
            res.json().then(({response, friendUsername}) => {
              if(response === 'Unauthorized') {
                // go to login page
              }else if(response === '') {
                // remove friend
              }
            })
          }
        }).catch(console.log)
    }
  }

  const handleProfile = ()=> {
	  router.get('/profile')
  }

  const handleEmojiContainer = ()=> {
    const isVisible = emoji.current.style.display === 'block'
    if(isVisible) emoji.current.style.display = 'none'
    else emoji.current.style.display = 'block'
  }

  const handleEmojiPicker = (emojiObject)=> {
    messageBox.current.value = messageBox.current.value + emojiObject.emoji
    setData('message', data.message + emojiObject.emoji)
  }

  const handleActiveChat = (chat)=> {
    setDoScroll(true)
    if(
      activeChat.fullName !== chat.fullName
      || activeChat.username !== chat.username
      || activeChat.conversationId !== chat.conversationId
      || activeChat.type !== chat.type
    ) {
      setActiveChat({
        'fullName': chat.fullName,
        'username': chat.username,
        'conversationId': chat.conversationId,
        'type': chat.type
      })
    }
  }

  const handleHide = (message)=> {
    const index = contentList.indexOf(message)
    return username !== message.username
      && (index - 1) >= 0
      && contentList[index - 1].username === message.username;
  }

  const handleCreateNewGroup = ()=> {
    newGroupModal.current.classList.remove('hidden')
  }

  return (
    <>
		{/* <ProfileModal 
			ref={profileModal} 
			friendList={friendList} 
			setFriendList={setFriendList} 
			blockList={blockList} 
			setBlockList={setBlockList}
		/> */}
		<ConnectModal 
			ref={connectModal} 
			csrf={csrf}
		/>
		<NewRoomModal 
			ref={newGroupModal} 
			friendList={friendList} 
			setGroup={setGroupList}
		/>
		<MainLayout>
			<main className={'main-container'}>
				<section className={'left'}>
					<div>
						<h3 onClick={handleProfile}>{firstName} {lastName}<span></span></h3>
						<div className={'search'}>
							<input ref={search} type="search" placeholder={'Search a friend or room ...'} onChange={handleSearchSuggestion} />
							<ul ref={searchList} className={'search-list'}>
								{
								searchSuggestionList.map(item => (
									<li key={item.conversationId} onClick={()=> {
									setDoScroll(true)
									handleActiveChat(item)
									search.current.value = ''
									searchList.current.classList.remove('show')
									}}>{item.fullName}</li>
								))
								}
							</ul>
						</div>
						<div id={'message-list'}>
						<details id={'rooms'}>
							<summary>Chat Rooms</summary>
							<input type='button' defaultValue={'Create New Room'} onClick={handleCreateNewGroup}/>
							{
								groupList.map(group => (
									<div key={group.conversationId} onClick={()=> handleActiveChat(group)}>
									<div></div>
									<div>
										<h6>{group.fullName}</h6>
										<p>
										{group.isLastSender ? 'You: ' : ''} {group.lastMessage}
										</p>
									</div>
									</div>
								))
							}
						</details>
						<details id={'all-friend'}>
							<summary>All Friend</summary>
							{
								friendList.map(friend => (
									<div key={friend.conversationId} onClick={()=> handleActiveChat(friend)}>
									<div></div>
									<div>
										<h6>{friend.fullName}</h6>
										<p>
										{friend.isLastSender ? 'You: ' : ''} {friend.lastMessage}
										</p>
									</div>
									</div>
								))
							}
						</details>
						</div>
					</div>
					<div>
						<input type="button" className={'btn'} defaultValue={'Connect with Others'} onClick={(e)=> {
							e.preventDefault()
							connectModal.current.classList.remove('hidden')
						}}/>
					</div>
				</section>
				<section className={'right'}>
					<div>
						<h4>{activeChat.fullName}</h4>
						<span></span>
					</div>
					<ul ref={messageList} onScroll={handleMessageListScroll}>
						<div></div>
						{
							contentList.map(message => (
								<li key={message.id} id={`message${message.id}`} className={(username === message.username ? 'main ' : '') + message.username}>
									<span style={{ display: handleHide(message) ? 'none' : '' }}>{message.fullName}</span>
									<div>
										<span
											style={{ opacity: contentList[contentList.indexOf(message) + 1]?.username === message.username ? '0' : '1' }}
										>{message.initial}</span>
										<p>{message.content}</p>
									</div>
								</li>
							))
						}
					</ul>
					<p ref={float}>Someone is typing <span></span></p>
					<div>
						<div onClick={handleEmojiContainer}>
							<div ref={emoji}>
								<EmojiPicker onEmojiClick={handleEmojiPicker} emojiStyle={EmojiStyle.GOOGLE} />
							</div>
						</div>
						<textarea ref={messageBox} name={'text'} tabIndex={0} onChange={(e)=> setData('message',e.currentTarget.value)}></textarea>
						<input type="button" className={'btn'} defaultValue={'Send'} disabled={processing} onClick={sendMessage}/>
					</div>
				</section>
			</main>
		</MainLayout>
    </>
  )
}

export default Main
