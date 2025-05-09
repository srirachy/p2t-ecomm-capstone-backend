import User from '../schemas/User.js';

export const authUser = async (req, res) => {
  const { idAuth0, lastActive } = req.body;

  if(!idAuth0 || !lastActive) {
    return res.status(400).json({ error: 'idAuth0 and lastActive are required'});
  }

  console.log(idAuth0);
  try {
    const updatedUser = await User.findOneAndUpdate(
        {idAuth0},
        {$set: {lastActive: new Date(lastActive)}},
        {new : true},
    );
    console.log(updatedUser);

    if(!updatedUser){
        return res.status(404).json({ error: 'User not found'});
    }

    res.status(200).json({success: true});
  } catch (error) {
    console.error('Error updated lastActive:', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

export const registerUser = async (req, res) => {
  const {idAuth0, email, name} = req.body;

  if (!idAuth0?.startsWith('auth0|') || !email) {
    return res.status(400).json({ error: 'Invalid Auth0 ID or email' });
  }

  const user = await User.findOneAndUpdate(
    { idAuth0 },
    {
        $setOnInsert: {
            idAuth0,
            email,
            name: name || email.split('@')[0],
            profilePic: "",
            shippingAddresses: [],
            phoneNum: null,
            paymentMethods: [],
        },
        $set: { lastActive: new Date() },
    },
    { upsert: true, new: true},
  );

  res.status(201).json({
    success: true,
    email: user.email,
    id: user._id,
  });
};
