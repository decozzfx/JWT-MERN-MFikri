import express from "express";
import {getUsers,Register, Login, Logout} from "../controllers/users.js";
import {refreshToken} from "../middleware/refresh_token.js";
import {verifyToken} from "../middleware/verify_token.js";

const router = express.Router()

// router.get('/users', getUsers) // dapat diakses walau user tidak login
router.get('/users', verifyToken ,getUsers) // dapat diakses jika user telah login
router.post('/users', Register)
router.post('/login', Login)
router.get('/token', refreshToken)
router.delete('/logout', Logout)

export default router