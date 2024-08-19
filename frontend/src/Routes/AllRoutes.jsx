import React from 'react'
import { Route,Routes } from 'react-router-dom'
import { Signup } from '../Pages/Signup'
import { Login } from '../Pages/Login'
import { Event } from '../Pages/Event'
import { Admin } from '../Pages/Admin'
export const AllRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/event' element={<Event />} />
        <Route path='/admin' element={<Admin />} />
    </Routes>
  )
}
