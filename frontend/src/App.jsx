
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import { Toaster } from 'react-hot-toast'

function App() {
  const [count, setCount] = useState(0)
  const {isSignedIn}=useUser()
  return (
    <>
     
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problems" element={isSignedIn?<ProblemsPage />: <Navigate to={"/"}/>} />   
      </Routes>

      <Toaster toastOptions={{duration:3000}}/>
    </>
  )
}

export default App


//tw ,daisyui,react-router,react-hot-toast,

//todo: react-query aka tanstack query,axios
