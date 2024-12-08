const userDB = require("../models/userModal");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/jwt");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async(req, res)=>{
    const {username, password, email} = req.body;
    if(!username || !password || !email){
        res.status(400);
        throw new Error("Please enter all the details properly");
    }
    else{
        const findUser = await userDB.findOne({email});
        if(findUser){
            res.status(400);
            throw new Error("User already exists")
        } else{
            const salt = await bcrypt.genSalt(10);

            const newUser = new userDB({
                username,
                password : await bcrypt.hash(password,salt),
                email
            });

            const savedUser = await newUser.save();

            if(savedUser){
                res.status(201).json({ message: 'User registered successfully' });
            }
            else{
                res.status(404);
                throw new Error("Error registering user");
            }
        }
    }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please enter all the details properly");
  }
  const findUser = await userDB.findOne({ username });
  if (!findUser) {
    res.status(404);
    throw new Error("User not found. Please register");
  }
  const isPasswordValid = await bcrypt.compare(password, findUser.password);
  if (!isPasswordValid) {
    res.status(401); // Unauthorized
    throw new Error("Password incorrect");
  }

  const token = generateToken(findUser._id);

  res.status(200).json({
    message: "Login successful",
    user: {
      id: findUser._id,
      username: findUser.username,
    },
    token,
  });
});

  module.exports = {
    registerUser,
    loginUser,
  };