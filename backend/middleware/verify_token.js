// untuk memverifikasi token

import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => { // function verifikasi token
    const authHeader = req.headers['authorization'] // ambil data header
    const token = authHeader && authHeader.split(' ')[1]   // ambil jika ada token di header di index ke-[1] -> split(' ') karena ada space antara bearer ke token
    if(token == null) return res.sendStatus(401) // jika token kosong maka unauthorize
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => { // langkah verifikasi , token dari header dicocokan dengan token di env
        if(err) return res.sendStatus(403) // jika token expired atau tidak benar maka forbidden
        req.email = decoded.email // karena token menyertakan email, berarti kita memiliki email di dalam decoded token
        next()
    })
}

