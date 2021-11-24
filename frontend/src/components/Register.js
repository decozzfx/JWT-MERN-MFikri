import React,{useState} from 'react' // useState membuat variable menjadi dinamis
import axios from 'axios'  // middleware untuk berinteraksi dengan API
import { useNavigate } from 'react-router-dom'

const Register = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [msg , setMsg] = useState('')
    const navigate = useNavigate()

    const Register = async (e) => {
      e.preventDefault() // agar ketika submit page tidak reload
      try {
        await axios.post('http://localhost:5000/users', { // mulai berinteraksi dengan API dengan axios
          name : name,                  // opsi data yang diambil dan kemudian data di post ke DB
          email : email,
          password : password,
          confPassword : confPassword
        })
        navigate('/')
      } catch (error) {
        if(error.response){
          setMsg(error.response.data.msg)  // pesan error
        }
      }
    }

    return (
       <section class="hero has-background-grey-light is-fullheight is-fullwidth">
         <div class="hero-body">
           <div class="container">
               <div className="columns is-centered">
                  <div className="column is-4-desktop">
                    <form className='box' onSubmit={Register}>
                      <p className='has-text-centered'>{msg}</p>
                        <div className="field">
                            <label className="label">Username</label>
                            <div className="controls">
                            <input type="text" className="input" placeholder='Username' value={name} onChange={(e) => setName(e.target.value)}/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="controls">
                            <input type="text" className="input" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Password</label>
                            <div className="controls">
                            <input type="password" className="input" placeholder='********' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Confirm Password</label>
                            <div className="controls">
                            <input type="password" className="input" placeholder='********' value={confPassword} onChange={(e) => setConfPassword(e.target.value)}/>
                            </div>
                        </div>
                        <div className="field">
                        <button className="button is-success is-fullwidth">Register</button>
                        </div>
                  </form>    
                </div>
              </div>
           </div>
         </div>
       </section>
    )
}

export default Register
