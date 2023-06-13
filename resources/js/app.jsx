import './bootstrap';
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import React from 'react'
import '../css/app.css'
import GlobalContext, {useGlobalVariable} from "./context/GlobalContext.jsx";

const AppWrapper = ({ App, props }) => {
  const global = useGlobalVariable()

  return (
    <BrowserRouter>
      <GlobalContext.Provider value={global}>
        <App {...props} />
      </GlobalContext.Provider>
    </BrowserRouter>
  )
}

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <AppWrapper App={App} props={props} />
    )
  },
})
