import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

export const login = async (req, res) => {
try {
    const {email, password} = req.body;
    const user = await User.findOne({
        email
    });
    const isPassCorrect = await bcryptjs.compare(password, user?.password || "");
    if (!user || !isPassCorrect){
        return res.status(400).json({
            error: "Invalid email or password"
        })
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
    })
    
} catch (error) {
    console.log("Error in login authController: ", error);
    res.status(500).json({
        error: "Internal server error"
    })
}
};

export const signup = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const {fullName, email, password, confirmPassword, adminKey} = req.body;
        if (password !== confirmPassword){
            return res.status(400).json({error: "Password did not match"});
        }
        const user = await User.findOne({email});
        if (user){
            return res.status(400).json({error: "username already exists"})
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        let role = "user";
        if (adminKey === process.env.ADMIN_KEY) {
            role = "admin";
        }

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role
        })
        if (newUser){
            const token = generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(200).json({
                jwt:token,
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role
            })
            console.log("role:", role)
        } else {
            res.status(400).json({
                error: "Invalid user data"
            })
        }
    } catch (error) {
        console.log("Error in signup authController: ", error);
        res.status(500).json({
            error: "Internal server error"
        })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout authController: ", error);
        res.status(500).json({
            error: "Internal server error"
        })
    }
}