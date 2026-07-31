const userService = require("../services/user.service");

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUser(Number(req.params.id));

    if (!user)
      return res.status(404).json({
        error: "User not found",
      });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await userService.deactivateUser(Number(req.params.id));

    res.json({
      message: "User deactivated",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};