const _authservice=require('../services/auth.service');

const register=async(req,res)=>{
    try {
        const user= await _authservice.registerUser(req.body);
        res.status(201).json({
            success:true,
            messgae:"User registered successfully",
            data:user
        });
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error?.message
        });
    }
}

module.exports = {
  register
};