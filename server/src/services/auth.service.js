const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const userRepository=require('../repositories/user.repository');

//register/signup //
const registerUser= async({
  firstName,
  lastName,
  email,
  password,
  phone
})=>{
 const isExistinguser=await userRepository.findUserByemail(email);
 if(isExistinguser){
    throw new Error("User already exist");
 }
 const hashPassword= await bcrypt.hash(password,10);
 const user=await userRepository.createUser({
    firstName,
    lastName,
    email,
    hashPassword,
    phone
 });
 return user;
}

module.exports = {
  registerUser
};