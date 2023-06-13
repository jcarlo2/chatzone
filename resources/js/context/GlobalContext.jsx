import {createContext, useState} from "react";

const GlobalContext = createContext({})

export const useGlobalVariable = ()=> {
    const url = 'http://127.0.0.1:8000'
    const [token, setToken] = useState(window.localStorage.getItem('czToken'))
    const [username, setUsername] = useState(window.localStorage.getItem('czUsername'))

    return {
        url: url,
        token: token,
        setToken: setToken,
        username: username,
        setUsername: setUsername,
    }
}

export default GlobalContext
