import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const initialState={
    email:'',
    password:''
}
export const Login = () => {
    const [credential,setCredential]=useState(initialState)
    const navigate=useNavigate()
    const handleSignup=()=>{
        navigate('/')
    }
    const handleChange=(e)=>{
        const {name,value}=e.target 
        setCredential((prev)=>{
            return {...prev,[name]:value}
        })
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            let res=await fetch('https://deploy-test-msnv.onrender.com/user/login',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(credential)
            })
            if(res.ok){
                let data=await res.json()
                if(data.role==='User')
                {
                    localStorage.setItem('token',data.token)
                    localStorage.setItem('userId', data.user);
                    localStorage.setItem('role',data.role)
                    setTimeout(() => {
                        navigate('/event')
                    }, 1000);
                }else if(data.role==='Admin'){
                    localStorage.setItem('token',data.token)
                    localStorage.setItem('userId', data.user);
                    localStorage.setItem('role',data.role)
                    setTimeout(() => {
                        navigate('/admin')
                    }, 1000);
                }else if(data.role==='Organizer'){
                    localStorage.setItem('token',data.token)
                    localStorage.setItem('userId', data.user);
                    localStorage.setItem('role',data.role)
                    setTimeout(() => {
                        navigate('/organizer')
                    }, 1000);
                }
            }else{
                let data=await res.json()
                alert(data.message)
            }
        }catch(err){
            alert(err)
        }
    }
  return (
    <form id="loginForm" onSubmit={handleSubmit}>
        <input type="email" name="email" value={credential.email} id="email" placeholder='email' onChange={(e)=>{
            handleChange(e)
        }} required />
        <input type="password" name="password" value={credential.password} id="password" placeholder='password' onChange={(e)=>{
            handleChange(e)
        }} required />
        <button type='submit'>Login</button>
        <button onClick={handleSignup} type='button'>Not a user? Register now!</button>
    </form>
  )
}
