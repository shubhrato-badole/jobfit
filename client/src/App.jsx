import React from "react"
import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import {AuthContex, useAuth} from "./pages/AuthContext"
import ProtectedRoute from "./pages/protectedRoutes"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import onboarding from "./pages/Onboarding"
import Dashboard from "./pages/Dashboard"
import jobSearch from "./pages/JobSearch"

import Analysze from "./pages/Analysze"
import Tracker from "./pages/Tracker"
import Profile from "./pages/Profile"




const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)

const AppRoutes = () =>{
const {user} = useAuth();
<Layout>
    <Routes>


      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={ user ? <Login/> : <Dashboard/>}></Route>
      <Route path="/register" element={user ? <Register/> : <Dashboard/>}></Route>

      <Route path="/onboarding" element= {<ProtectedRoute> <onboarding/> </ProtectedRoute> }/>
      <Route path="/onboarding" element= {<ProtectedRoute> <Dashboard/> </ProtectedRoute> }/>
      <Route path="/onboarding" element= {<ProtectedRoute> <jobSearch/> </ProtectedRoute> }/>
      <Route path="/onboarding" element= {<ProtectedRoute> <Analysze/> </ProtectedRoute> }/>
     <Route path="/onboarding" element= {<ProtectedRoute> <Tracker/> </ProtectedRoute> }/>
      <Route path="/onboarding" element= {<ProtectedRoute> <Profile/> </ProtectedRoute> }/>
    </Routes>
    </Layout>
}