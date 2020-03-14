import { model, Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document{
    email: string,
    password: string,
    comparePassword: (arg0: string) => Promise<boolean>
}

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
})

// Using function(){} to use partent context
userSchema.pre<IUser>('save', async function(next) {
    const user = this // <- this == userSchema context
    if (!user.isModified('password')) return next()
    
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)
    user.password = hash
    next()
})

// Using function(){} to use partent context
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    const user = this // <- this == userSchema context
    return await bcrypt.compare(password, user.password)
}

export default model<IUser>('User', userSchema)