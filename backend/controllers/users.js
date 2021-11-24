import Users from "../model/usermodel.js";
import bcrypt from 'bcrypt' // untuk enkripsi password
import jwt from 'jsonwebtoken' // json web token 

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes : ['id', 'name', 'email']
        })
        res.json(users)
    } catch (error) {
        console.info(error)
    }
}

export const Register = async (req, res, next) => {
    const { name, email, password, confPassword } = req.body
    if(password !== confPassword) return res.status(400).json({msg: 'Password tidak sama'})
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        await Users.create({
            name : name,
            email : email,
            password : hashPassword
        })
        res.json({msg : 'register berhasil'})
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
          );
          next();
    } catch (error) {
        console.info(error)
    }
}

export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where : {
                email : req.body.email
            }
        })
         const match = await bcrypt.compare(req.body.password, user[0].password) // user[0] is index data (single data)
         if(!match) return res.status(400).json({ msg : 'Wrong Password'})
        const userId = user[0].id  // menconstruct data user
        const name = user[0].name
        const email = user[0].email
        // access token
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {   // sign() is payload , secret key from .env
            expiresIn : '20s'
        })     
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET, {   // sign() is payload , secret key from .env
            expiresIn : '1d'
        })     
        await Users.update({refresh_token : refreshToken},{  // simpan refresh token
            where : {
                id : userId
            }
        })
        res.cookie('refreshToken', refreshToken, {  // http only cookie , yang akan dikirimkan ke client  |  nama cookie , value cookie
            httpOnly :  true,
            maxAge : 24 * 60 * 60 *1000, // expired cookie dalam militoken
            //secure : true // dalam https jika di server luar bukan local
        })                
        res.json({ accessToken })
            
    } catch (error) {
        res.status(404).json({ msg : 'Email tidak terdaftar'})
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) return res.sendStatus(204) // jika token tidak ada maka send status no content
    const user = await Users.findAll({
        where : {                               // mencari token yg sama dengan refresh token di cookies
            refresh_token : refreshToken 
        }
    })
    if(!user) return res.sendStatus(204) // jika tidak ada kecocokan token di db maka no content
    const userId = user[0].id           // construct id
    await Users.update({refresh_token : null}, {  // ubah refresh token menjadi null / kosong
        where : {                       // berdasarkan kecocokan id di db
            id : userId
        }
    })
    res.clearCookie('refreshToken')  // hapus cookie yang bernama refreshToken
    return res.sendStatus(200)
}