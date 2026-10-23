const _authservice = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const user = await _authservice.registerUser(req.body);
        res.status(201).json({
            success: true,
            messgae: "User registered successfully",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error?.message
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await _authservice.login(email, password);
        res.status(200).json({
            status: "success",
            message: "Login successfully!",
            data: result
        })
    }
    catch (error) {
        res.status(401).json({
        success: false,
        message: error.message
        });
    }
}

const getCurrentUser = async(req,res,next)=>{
    try {
        const {userId}= await req.user;
        const authContext = await _authservice.validateUser(userId);
         if (!authContext) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.status(200).json({
            message: "Details fetched successfully!",
            data: authContext
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,login,getCurrentUser 
};