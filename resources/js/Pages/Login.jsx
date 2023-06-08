import React from 'react'
import MainLayout from "./Layout/MainLayout.jsx"
import {useForm} from '@inertiajs/react'

const Login = ()=> {
  const {data, setData, processing, post, errors} = useForm({
    username: '',
    password: '',
    remember: false,
  })

  const handleLogin = (e)=> {
    e.preventDefault()
    post('/login')
  }

  return (
    <MainLayout>
      <form onSubmit={handleLogin} className={'login-container'}>
        <input type="text" placeholder={'Username'} name={'username'} onChange={(e)=> setData('username', e.target.value)}/>
        {errors.username && <div className={'invalid'}>{errors.username}</div>}
        <input type="password" placeholder={'Password'} name={'password'} onChange={(e)=> setData('password',e.target.value)}/>
        {errors.password && <div className={'invalid'}>{errors.password}</div>}
        <label>
          Remember Me
          <input type="checkbox" name={'remember'} onChange={(e)=> setData('remember',e.target.checked)}/>
        </label>
        <input type="submit" defaultValue={'Login'} disabled={processing}/>
      </form>
    </MainLayout>
  )
}

export default Login
