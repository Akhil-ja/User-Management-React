import User from "../models/userModel.js";

const userlist = async (req, res) => {
  try {
    let users = await User.find();
    users = users.filter((user) => !user.is_admin);

    console.log(users);
    res.json({ users: users });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name);

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      is_admin: false,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(401);
    throw new Error("User creation failed");
  }
};

const UpdateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const { name, email } = req.body;
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();
    }
    res.json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.log(err.message);
    res.status(401);
    throw new Error("User updation failed");
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    await User.findByIdAndDelete(req.params.userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ message: "User deletion failed" });
  }
};

export { userlist, createUser, UpdateUser, deleteUser };
