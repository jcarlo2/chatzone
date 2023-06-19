import React from 'react'
const MainLayout = ({children})=> {


  return (
    <>
      <h1>ChatZone</h1>
      <main>
        {children}
      </main>
    </>
  )
}

export default MainLayout
