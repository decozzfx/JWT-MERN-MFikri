// membuat access token yang expired tetap aktif tanpa harus login kembali
import jwt from 'jsonwebtoken'
import Users from '../model/usermodel.js' 

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken // mengambil value yang kita save di cookie
        if(!refreshToken) return res.sendStatus(401)
        const user = await Users.findAll({  // membandingkan refresh token dari cookie dengan refresh token di db
            where : {
                refresh_token : refreshToken
            }
        }) 
        if(!user[0]) return res.sendStatus(403)  // jika token tidak sama kirim pesan error , user[0] karena single data
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => { // verifikasi token dengan refresh token secret di env
            if(err) return res.sendStatus(403)
            const userId = user[0].id
            const name = user[0].name
            const email = user[0].email
            const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{ //membuat access token baru
                expiresIn: '15s'
            })
            res.json({accessToken}) // mengirim respon ke client
        })

    } catch (error) {
        console.info(error)
    }
}