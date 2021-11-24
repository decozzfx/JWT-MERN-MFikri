import React, { useState, useEffect } from 'react'
import axios from 'axios'  //untuk berinteraksi dengan API
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import Navbar from './Navbar'

const Dashboard = () => {
    const [ name, setName] = useState('')
    const [ token, setToken] = useState('')
    const [ expire, setExpire] = useState('')
    const [ users, setUsers] = useState([])   // untuk data users
    const navigate = useNavigate()
    
    //// untuk mendapatkan refresh token untuk akses getUsers sebelum ada axios interceptors
    useEffect(() => {
        refreshToken()
        getUsers()
        // eslint-disable-next-line
    }, [])
    
    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token') // ambil/generate refreshToken
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken) // decode accessToken
            setName(decoded.name)
            setExpire(decoded.exp) // exp -> expired token (token)
        } catch (error) {
            if(error.response){
                navigate('/')
            }
        }
    }

    // memperbarui token yang telah expired tanpa refresh page
    const axiosJWT = axios.create() // instance untuk axios

    axiosJWT.interceptors.request.use( async(config) => { //untuk melakukan pengecekan sebelum req
        const currentDate = new Date()  // ambil waktu sekarang
        if(expire * 1000 < currentDate.getTime()){ // dikali 1000 karena dalam milisecond 
            const response = await axios.get('http://localhost:5000/token') // jika waktu expire lebih kecil maka panggil API token
            // update token untuk authorization yang di header
            config.headers.Authorization = `Bearer ${response.data.accessToken}` //ambil access token baru dari API 
            setToken(response.data.accessToken) // set kembali token baru untuk digunakan lagi untuk refreshToken
            const decoded = jwt_decode(response.data.accessToken) // decode token baru
            setName(decoded.name) // perbarui data dari decode token baru
            setExpire(decoded.exp) // perbarui data expire dengan decode token baru
        }
        return config
    }, (error) => {
        return Promise.reject(error) //
    })

    const getUsers = async () => {
        const response = await axiosJWT.get('http://localhost:5000/users', { //ambil data users dengan membawa token 
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        setUsers(response.data)
    }

    return (
        <div className='container'>
            <Navbar/>
            <div className="container mt-5">
            <h1>Welcome back : {name}</h1>
            <button onClick={getUsers} className='button is-info'>Get Users</button>
            <table className='table is-striped is-fullwidth'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    { users.map((user, index) => (  // () return dalam jsx sintax
                    <tr key={ user.id }>
                        <th>{index +1}</th>
                        <th>{user.name}</th>
                        <th>{user.email}</th>
                    </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default Dashboard
