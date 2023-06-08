import GlobalContext, {useGlobalVariable} from "../../context/GlobalContext.jsx";
import React from 'react'
import {router} from "@inertiajs/react";
const MainLayout = ({children})=> {
  const global = useGlobalVariable()

  return (
    <GlobalContext.Provider value={global}>
      <h1 onClick={()=> {
        router.get('/logout')
      }}>ChatZone</h1>
      <main>
        {children}
      </main>
    </GlobalContext.Provider>
  )
}

export default MainLayout
