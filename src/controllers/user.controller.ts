import { Request, Response } from 'express'
import User, { IUser } from '../models/user'
import jwt from 'jsonwebtoken'
import config from '../config/config'

function createToken(user: IUser) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret , {
        expiresIn: 86400
    })
}

export const signUp = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({msg: 'Please. Send your email and password'})
    }
    const user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).json({ msg: 'The user already exists' })
    }
    const newUser = new User(req.body)
    await newUser.save()
    return res.status(201).json(newUser)
}

export const signIn = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({msg: 'Please. Send your email and password'})
    }
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ msg: 'The user does not exists' })
    }
    const isMatch = await user.comparePassword(req.body.password)
    if (isMatch) {
        return res.status(200).json({ token: createToken(user) })
    }
    return res.status(400).json({
        msg: 'The email or password are incorrect'
    })
}

// {
// 	"email": "eliasdefrancisco@gmail.com",
// 	"password": "hello1234"
// }

// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNmE3MDIzNDQ5M2M5YjYxNmMxYTQ3NyIsImVtYWlsIjoiZWxpYXNkZWZyYW5jaXNjb0BnbWFpbC5jb20iLCJpYXQiOjE1ODQwMzQ3NzYsImV4cCI6MTU4NDEyMTE3Nn0.yHXnXeazGTXWiDdmhx9SgcMzHyDD8kHxvzTt1mTkcp4"
// }