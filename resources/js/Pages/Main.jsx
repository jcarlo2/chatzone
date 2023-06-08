import React, {useEffect, useRef, useState} from 'react'
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import Echo from "laravel-echo"
import Pusher from 'pusher-js'
import {useForm, usePage} from "@inertiajs/react";
import MainLayout from "./Layout/MainLayout.jsx";
import ConnectModal from "../components/ConnectModal.jsx";

const Main = ()=> {
  const csrf = usePage().props.csrf
  const {id, username, firstName, lastName} = usePage().props.user
  const [friendList, setFriendList] = useState(usePage().props.friends)
  const [activeFriend, setActiveFriend] = useState({
    fullName: '',
    username: '',
    conversationId: '',
    type: ''
  })
  const [contentList, setContentList] = useState([])
  const [messageLoadURL, setMessageLoadURL] = useState(null)
  const emoji = useRef()
  const messageBox = useRef()
  const messageList = useRef()
  const float = useRef()
  const connectModal = useRef()
  const {data, setData, post, processing} = useForm({
    message: '',
    channel: -99
  })
  const [doScroll, setDoScroll] = useState(false)

  useEffect(()=> {
    findAllMessages()
    setData('channel', activeFriend.conversationId)
  },[activeFriend])

  useEffect(()=> {
    if(doScroll) messageList.current.scrollTop = messageList.current.scrollHeight
    setDoScroll(false)
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

    echo.connector.pusher.connection.bind('connected', (e) => {
      console.log('WebSocket connection established');
      friendList.forEach(friend => {
        const channel = echo.join(`presence.play.${friend.conversationId}`)
          .here((event)=> {
            messageBox.current.addEventListener('focus',()=> {
              if(activeFriend.conversationId !== friend.conversationId) return
              channel.whisper('typing',{
                fullName: username,
                isGroup: 'false'
              })
            })
            messageBox.current.addEventListener('blur',()=> {
              channel.whisper('stop-typing',{})
            })
          })
          .listen('.play-event',(event)=> {
            handleChangeLastMessages(event)
            if(activeFriend.conversationId !== event.channel) return
            messageBox.current.value = ''
            handleContentList(event)
            // make a dialog for new message, when clicked, scroll to bottom
            // messageList.current.scrollTop = messageList.current.scrollHeight;
          })
          .listenForWhisper('typing',(e)=> float.current.classList.add('show'))
          .listenForWhisper('stop-typing',(e)=> float.current.classList.remove('show'))
      })
    });

    return ()=> {
      friendList.forEach(friend => {
        echo.channel(friend.conversationId).unsubscribe()
      })
      echo.disconnect()
    }
  },[friendList.length, activeFriend])

  const handleChangeLastMessages = (event)=> {
    setFriendList(prevState => prevState.map(friend => {
      if (friend.conversationId === event.channel) {
        return {
          ...friend,
          lastMessage: event.content,
          isLastSender: friend.username === event.sender
        }
      }
      return friend
    }))
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
    fetch('http://localhost:8000/api/user/find-all-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversationId: activeFriend.conversationId
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
          conversationId: activeFriend.conversationId
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
    if(data.message !== '' && data.channel >= 0) post('/event')
  }

  const handleEmojiContainer = ()=> {
    const isVisible = emoji.current.style.display === 'block'
    if(isVisible) emoji.current.style.display = 'none'
    else emoji.current.style.display = 'block'
  }

  const handleEmojiPicker = (emojiObject)=> {
    messageBox.current.value = messageBox.current.value + emojiObject.emoji
  }

  const handleActiveFriend = (friend)=> {
    setDoScroll(true)
    if(
      activeFriend.fullName !== friend.fullName
      || activeFriend.username !== friend.username
      || activeFriend.conversationId !== friend.conversationId
      || activeFriend.type !== friend.type
    ) {
      setActiveFriend({
        'fullName': friend.fullName,
        'username': friend.username,
        'conversationId': friend.conversationId,
        'type': friend.type
      })
    }
  }

  const handleHide = (message)=> {
    const index = contentList.indexOf(message)
    return username !== message.username
      && (index - 1) >= 0
      && contentList[index - 1].username === message.username;
  }

  return (
    <>
      <ConnectModal ref={connectModal} csrf={csrf}/>
      <MainLayout>
        <main className={'main-container'}>
          <section className={'left'}>
            <div>
              <h3>{firstName} {lastName}<span></span></h3>
              <input type="search" placeholder={'Search a friend...'}/>
              <div id={'message-list'}>
                <details id={'unread'}>
                  <summary>Unread</summary>
                  <div>
                    <div></div>
                    <div>
                      <h6>Joaquin Bordado</h6>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus enim, et fuga in itaque iusto! Aliquam earum, est, excepturi incidunt iusto laudantium magnam maxime nesciunt, quae repellendus sint sit voluptatibus.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div></div>
                    <div>
                      <h6>Joaquin Bordado</h6>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus enim, et fuga in itaque iusto! Aliquam earum, est, excepturi incidunt iusto laudantium magnam maxime nesciunt, quae repellendus sint sit voluptatibus.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div></div>
                    <div>
                      <h6>Joaquin Bordado</h6>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus enim, et fuga in itaque iusto! Aliquam earum, est, excepturi incidunt iusto laudantium magnam maxime nesciunt, quae repellendus sint sit voluptatibus.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div></div>
                    <div>
                      <h6>Joaquin Bordado</h6>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus enim, et fuga in itaque iusto! Aliquam earum, est, excepturi incidunt iusto laudantium magnam maxime nesciunt, quae repellendus sint sit voluptatibus.
                      </p>
                    </div>
                  </div>
                </details>
                <details id={'rooms'}>
                  <summary>Chat Rooms</summary>
                  <div>
                    <div></div>
                    <div>
                      <h6>Joaquin Bordado</h6>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus enim, et fuga in itaque iusto! Aliquam earum, est, excepturi incidunt iusto laudantium magnam maxime nesciunt, quae repellendus sint sit voluptatibus.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div></div>
                    <div>
                      <h6>Joaquin Bordado</h6>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus enim, et fuga in itaque iusto! Aliquam earum, est, excepturi incidunt iusto laudantium magnam maxime nesciunt, quae repellendus sint sit voluptatibus.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div></div>
                    <div>
                      <h6>Joaquin Bordado</h6>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus enim, et fuga in itaque iusto! Aliquam earum, est, excepturi incidunt iusto laudantium magnam maxime nesciunt, quae repellendus sint sit voluptatibus.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div></div>
                    <div>
                      <h6>Joaquin Bordado</h6>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus enim, et fuga in itaque iusto! Aliquam earum, est, excepturi incidunt iusto laudantium magnam maxime nesciunt, quae repellendus sint sit voluptatibus.
                      </p>
                    </div>
                  </div>
                </details>
                <details id={'all-friend'}>
                  <summary>All Friend</summary>
                  {
                    friendList.map(friend => (
                      <div key={friend.conversationId} onClick={()=> handleActiveFriend(friend)}>
                        <div></div>
                        <div>
                          <h6>{friend.fullName}</h6>
                          <p>
                            {friend.isLastSender ? '' : 'You: '} {friend.lastMessage}
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
                console.log(connectModal)
              }}/>
            </div>
          </section>
          <section className={'right'}>
            <div>
              <h4>{activeFriend.fullName}</h4>
              <span></span>
            </div>
            <ul ref={messageList} onScroll={handleMessageListScroll}>
              <div></div>
              {
                contentList.map(message => (
                  <li key={message.id} id={message.id} className={(username === message.username ? 'main ' : '') + message.username}>
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
