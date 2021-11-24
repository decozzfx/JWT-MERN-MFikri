import React, {useState} from 'react'
import axios from 'axios'  //untuk berinteraksi dengan API
import { useNavigate } from 'react-router-dom' // untuk meredirect

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg , setMsg] = useState('')
    const navigate = useNavigate()

    const Auth = async (e) => {
      e.preventDefault()
      try {
        await axios.post('http://localhost:5000/login', { // API Login
          email : email,        // ambil data ke API
          password : password
        })
         navigate('/dashboard')
      } catch (error) {
          if(error.response){
            setMsg(error.response.data.msg) // Pesan error
          }
      }
    }

    return (
       <section class="hero has-background-grey-light is-fullheight is-fullwidth">
         <div class="hero-body">
           <div class="container">
               <div className="columns is-centered">
                  <div className="column is-4-desktop">
                    <form className='box' onSubmit={Auth}>
                      <p className="has-text-centered">{msg}</p>
                      <div className="field">
                        <label className="label">Email or Username</label>
                        <div className="controls">
                          <input type="text" className="input" placeholder='Email or Username' value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                      </div>
                      <div className="field">
                        <label className="label">Password</label>
                        <div className="controls">
                          <input type="password" className="input" placeholder='********' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                      </div>
                      <div className="field">
                        <button className="button is-success is-fullwidth">Login</button>
                      </div>
                  </form>    
                </div>
              </div>
           </div>
         </div>
       </section>
    )
}

export default Login
