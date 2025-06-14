import React, { createContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const [userData, setUserData] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)               //whenever page reloads dom loads due to which states are intialized by their values
    const [problems, setProblems] = useState([])
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const adminUrl = import.meta.env.VITE_ADMIN_URL

    const getUserData = async () => {

        try {
            
            const {data}  = await axios.get(`${backendUrl}/api/user/my-profile`, {headers:{token}})
            if(data.success){
                setUserData(data.user)
            }
            else {
                toast.error(error.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            
        }
    }

    const getProblems = async () => {

        try {
            
            const {data} = await axios.get(`${backendUrl}/api/problem/all`)
            if(data.success){
                setProblems(data.problems)
            }
            else {
                setProblems([])
                toast.error(error.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        userData,setUserData,
        token,setToken,
        problems,setProblems,
        backendUrl,adminUrl,
        getUserData,getProblems,
    }

    useEffect(()=>{
        getProblems();
    },[])

    //this will be called every time token changes
    useEffect(()=>{
        if(token)getUserData()
        else setUserData(null)
    },[token])


    return( 
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
