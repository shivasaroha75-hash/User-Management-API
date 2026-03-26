const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const FILE = path.join(__dirname, "../data/users.json");

// Read users safely
const readUsers = () => {
  try {
    const data = fs.readFileSync(FILE, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Write users
const writeUsers = (data) => {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
};

// ✅ GET /users
exports.getUsers = (req, res) => {
  try {
    let users = readUsers();
    const { search, sort, order } = req.query;

    if (search) {
      users = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort) {
      users.sort((a, b) => {
        if (order === "desc") return a[sort] < b[sort] ? 1 : -1;
        return a[sort] > b[sort] ? 1 : -1;
      });
    }

    res.json({ success: true, data: users });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ GET /users/:id
exports.getUserById = (req, res) => {
  try {
    const users = readUsers();
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ POST /users
exports.createUser = (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const users = readUsers();

    const newUser = {
      id: uuidv4(),
      name,
      email
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ success: true, data: newUser });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ PUT /users/:id
exports.updateUser = (req, res) => {
  try {
    let users = readUsers();
    const index = users.findIndex(u => u.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    users[index] = { ...users[index], ...req.body };
    writeUsers(users);

    res.json({ success: true, data: users[index] });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ DELETE /users/:id
exports.deleteUser = (req, res) => {
  try {
    let users = readUsers();
    const filtered = users.filter(u => u.id !== req.params.id);

    if (users.length === filtered.length) {
      return res.status(404).json({ message: "User not found" });
    }

    writeUsers(filtered);

    res.json({ success: true, message: "User deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};