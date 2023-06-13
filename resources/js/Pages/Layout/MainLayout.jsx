import GlobalContext, {useGlobalVariable} from "../../context/GlobalContext.jsx";
import React from 'react'
import {router} from "@inertiajs/react";
const MainLayout = ({children})=> {


  return (
    <>
      <h1 onClick={()=> {
        router.get('/logout')
      }}>ChatZone</h1>
      <main>
        {children}
      </main>
    </>
  )
}

export default MainLayout
