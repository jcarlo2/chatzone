import React, {forwardRef, useContext, useRef, useState} from "react";
import GlobalContext from "../context/GlobalContext.jsx";

const ConnectModal = forwardRef(({csrf},ref)=> {
  const url = useContext(GlobalContext).url
  const searchInput = useRef()
  const discover = useRef()
  const [searchList, setSearchList] = useState([])

  const handleSearch = (e)=> {
    const search = e.currentTarget.value
    if(search.trim() === '') return
    fetch(`${url}/user/search`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrf
      },
      body: JSON.stringify({search})
    })
      .then(res => {
        if(res.ok) {
          res.json().then(setSearchList)
        }
      }).catch(console.log)
  }

  const handleStrangerStatus = (e, id, type)=> {
    const status = e.currentTarget.value
    fetch(`${url}/user/update-friend-status`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrf
      },
      body: JSON.stringify({status, id})
    })
      .then(res => {
        if(res.ok) {
          res.json().then(({status, friendId}) => {
             if(type === 'change') {
              setSearchList(prevState => prevState.map(stranger => {
                if(stranger.id === friendId) return {
                  ...stranger,
                  status
                }
                return stranger
              }))
             } else {
              setSearchList(prevState => prevState.filter(state => state.id !== friendId))
             }
          })
        }
      }).catch(console.log)
  }

  return (
     <div className={'modal-container hidden'} ref={ref}
          onClick={(e)=> {
           if(e.target === e.currentTarget) {
             e.currentTarget.classList.add('hidden')
             searchInput.current.value = ''
             setSearchList([])
           }}}
     >
       <main className={'modal connect-modal'}>
         <h1>Discover New Connections</h1>
         <input ref={searchInput} type="text" placeholder={'Search a friend ...'} onChange={handleSearch}/>
         <section>
           <table>
             <tbody ref={discover}>
              {
                searchList.map(stranger => (
                  <tr key={stranger.id}>
                    <td>{stranger.initial}</td>
                    <td>
                      <p>{stranger.fullName}</p>
                    </td>
                    <td>
                      <input type="button" defaultValue={
                        stranger.status === 'Pending Request'
                          ? 'Pending'
                          : stranger.status === 'Pending Approved'
                          ? 'Accept'
                          : stranger.status === 'Friend'
                          ? 'Unfriend'
                          : stranger.status
                      } onClick={(e)=> handleStrangerStatus(e, stranger.id,'change')}/>
                      <input type="button" defaultValue={
                        stranger.status === 'Pending Approved'
                          ? 'Decline'
                          : 'Block'
                      }
                       onClick={(e)=> handleStrangerStatus(e, stranger.id)}/>
                    </td>
                  </tr>
                ))
              }
             </tbody>
           </table>
         </section>
       </main>
     </div>
  )
})

export default ConnectModal
