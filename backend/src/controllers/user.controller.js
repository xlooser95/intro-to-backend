import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //basic validation

        if(!username || !email || !password) {
            return res.status(400).json({message: "ALL fields are important!"})
        }

        // check if user is already registerd in the system
        const existing = await User.findOne({ email: email.toLowerCase() });
        if(existing) {
            return res.status(400).json({message: "User Already Exists !"});
        }

        //create a user 

        const user = await User.create({
            username, 
            email: email.toLowerCase(),
            password,
            loggedIn: false,

        })

        res.status(201).json({
            message: "User Registered Successfully !",
            user: {id: user._id, email: user.email, username: user.username }
        });
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

const loginUser = async (req, res) => {
    try {
        // checking if the user already exists
        const { email, password} = req.body;

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if(!user) return res.status(400).json({
            message: "User not found"
        });

        // compare the user entered password with database password
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({
            message: "Invalid Credentials"
        })

        res.status(200).json({
            message: "User Logged In",
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
        
    }
}

const logoutUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne ({
            email: email.toLowerCase()
        });

        if(!user) return res.status(404).json({
            message: "User Not Found"
        });

        res.status(200).json({
            message: "Logout Successful"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        });
    }
}

export {
    registerUser,
    loginUser,
    logoutUser
}