import express from "express";
import dotenv from 'dotenv'  // import env for set secret token from .env file
import db    from './config/database.js'  // connection db file
import router from "./routes/index.js";     //package untuk membuat router end point API
import cookieParser from "cookie-parser"; // package untuk express dapat menerima data jenis JSON
import cors from 'cors' // agar API dapat diakses dari luar domaib
// import Users from "./model/usermodel.js";

// set env
dotenv.config()

// set express
const app = express()

// set db connection
try{
    await db.authenticate()
    console.info(' Database is Connected')
    // await Users.sync() // jika tidak memiliki table user dalam db maka secara otomatis sequelize akan mengeneratekan
}catch(error){
    console.info(error)
}

// middleware, Perhatikan urutan dari middleware dibawah ini
app.use(cors({ credentials:true, origin: 'http://localhost:3000' })) // meminta / req agar client mengirimkan credentialnya , origin -> mengizinkan domain tertentu dapat mengakses API
app.use(cookieParser()) // set express cookieParser untuk menerima value dari cookienya 
app.use(express.json()) // set express untuk menerima json
app.use(router) // set express menggunakan router


// set web server
app.listen(5000, () => console.info('Server running at http://localhost:5000'))
