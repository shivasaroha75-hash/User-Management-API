const express = require("express");
const app = express();

const userRoutes = require("./routes/userRoutes");

app.use(express.json());

// Routes
app.use("/users", userRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("User API Running 🚀");
});

// ✅ IMPORTANT FIX
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});