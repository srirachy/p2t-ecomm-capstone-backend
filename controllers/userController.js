import User from '../schemas/User.js';

// export const authUser = async (req, res) => {
//   const {email, password} = req.body;
//   const user = await User.findOne({ email });

//   if(user && (user.password === password)) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//     });
//   } else {
//     res.status(401);
//     throw new Error('Invalid email or password');
//   }
// };

// export const registerUser = async (req, res) => {
//   const {email, password, name} = req.body;
//   const user = await User.findOne({ email });
  
//   if(!user) {
//     const newUser = new User({
//       email: email,
//       password: password,
//       name: name,
//     });

//     newUser.save();
//     res.send(email + ' is registed!');
//   } else {
//     res.status(401);
//     throw new Error(email + ' already exists. Please sign in!');
//   }
// };
