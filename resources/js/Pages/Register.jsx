import {useNavigate} from "react-router-dom";
import React, {useContext, useRef} from "react";
import GlobalContext from "../context/GlobalContext";
import MainLayout from "./Layout/MainLayout.jsx";
import {Link, useForm} from "@inertiajs/react";

const Register = ({alert})=> {
  const url = useContext(GlobalContext).url
  const navigate = useNavigate()
  const userRef = useRef()
  const passRef = useRef()
  const passConfirmRef = useRef()
  const emailRef = useRef()
  const birthRef = useRef()
  const {data, setData, processing, post, errors} = useForm({
    'username': '',
    'password': '',
    'password_confirmation': '',
    'email': '',
    'firstName': '',
    'lastName': '',
    'gender': '',
    'birthdate': '',
  })

  // FIX THIS use useform()
    const handleRegister = (e)=> {
        e.preventDefault()
       post('/register')
    }

    const showAlert = (message)=> {
        const err = Object.keys(message.errors)
        let alertMessage = ''
        err.forEach(key => {
            alertMessage += ' ' + message.errors[key] + '<br> <br>'
        })
        alert.current.classList.add('show')
        alert.current.innerHTML = alertMessage
        setTimeout(()=> alert.current.classList.remove('show'),3000)
    }

    const changeInputBorder = (message)=> {
        const err = Object.keys(message.errors)

        if(err.includes('username')) userRef.current.classList.add('invalid')
        else userRef.current.classList.remove('invalid')

        if(err.includes('email')) emailRef.current.classList.add('invalid')
        else emailRef.current.classList.remove('invalid')
    }

    return (
        <MainLayout>
          <main id={'registerContainer'}>
            <p>Already have an account? <Link href={'/login'}>Sign in</Link></p>
            <form onSubmit={handleRegister}>
              {errors.username && <div className={'invalid'}>{errors.username}</div>}
              <input ref={userRef} type="text" name={'username'} placeholder={'Username'} onChange={(e)=> setData('username',e.currentTarget.value)}/>
              {errors.password && <div className={'invalid'}>{errors.password}</div>}
              <input ref={passRef} type="password" name={'password'} placeholder={'Password'} onChange={(e)=> setData('password',e.currentTarget.value)}/>
              {errors.password_confirmation && <div className={'invalid'}>{errors.password_confirmation}</div>}
              <input ref={passConfirmRef} type="password" name={'password_confirmation'} placeholder={'Confirm Password'} onChange={(e)=> setData('password_confirmation',e.currentTarget.value)}/>
              {errors.email && <div className={'invalid'}>{errors.email}</div>}
              <input ref={emailRef} type="email" name={'email'} placeholder={'Email'} onChange={(e)=> setData('email',e.currentTarget.value)}/>
              {errors.firstName && <div className={'invalid'}>{errors.firstName}</div>}
              <input type="text" name={'firstName'} placeholder={'First Name'} onChange={(e)=> setData('firstName',e.currentTarget.value)}/>
              {errors.lastName && <div className={'invalid'}>{errors.lastName}</div>}
              <input type="text" name={'lastName'} placeholder={'Last Name'} onChange={(e)=> setData('lastName',e.currentTarget.value)}/>
              {errors.gender && <div className={'invalid'}>{errors.gender}</div>}
              <select name="gender" id="gender" onChange={(e)=> setData('gender',e.currentTarget.value)}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.birthdate && <div className={'invalid'}>{errors.birthdate}</div>}
              <fieldset>
                <legend>Birthdate</legend>
                <input ref={birthRef} type="date" name={'birthdate'} min={'1900-01-01'} onChange={(e)=> setData('birthdate',e.currentTarget.value)}/>
              </fieldset>
              <input type="submit" value={'Register'}/>
            </form>
          </main>
        </MainLayout>
    )
}

export default Register
