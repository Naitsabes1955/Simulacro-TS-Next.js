import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//encrypt password
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt)
}

//login compare password
export const comparePassword = async (password: string, hash : string): Promise<boolean> => {
    return await bcrypt.compare(password,hash)
}

//Generate JWT in Login
export const generateToken = (payload: {userId: string; role: string}) : string => {
    if (!process.env.JWT_SECRET){
        throw new Error("JWT_SECRET it's not defined in enviorement variables")
    }
    return jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn: "1h"
    })
}

//verify JWT (validation and middleware)
export const verifyToken = (token: string) => {
    try {
        if (!process.env.JWT_SECRET) return null;
        return jwt.verify(token,process.env.JWT_SECRET)
    } catch (error) {
        return null
    }
}