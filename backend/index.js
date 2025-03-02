const express = require("express");
const mongoose = require("mongoose"); // ADD THIS LINE
const path = require("path");
const TodoModel = require("./model/Todo"); // ADD THIS LINE
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors({
  origin: [
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
    'http://localhost:3000'
  ]
}));

// ================== MONGO DB CONNECTION ==================
const connectionString =
	"mongodb+srv://sarahcancode:todoapp@todoapp.1v26q.mongodb.net/todoDB?retryWrites=true&w=majority";
	mongoose.set("strictQuery", false); // Fixes the warning

mongoose
	.connect(connectionString)
	.then(() => console.log("✅ Connected to MongoDB"))
	.catch((err) => console.log("🔥 MongoDB connection error:", err));

// ================== MIDDLEWARE ==================
app.use(express.json()); // Allow JSON data in requests
app.use(express.static(path.join(__dirname, "../../frontend"))); // Serve CSS/JS/HTML

// ================== ROUTES ==================
// Serve HTML (optional but safe)
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// --------------- CRUD API FOR TODOS ---------------
// GET all todos
// Example for GET /todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await TodoModel.find({});
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Server error" }); // Changed to JSON
  }
});

// Do the same for POST, DELETE, PUT routes!

// POST a new todo
app.post("/todos", async (req, res) => {
	try {
		const newTodo = await TodoModel.create({ text: req.body.text });
		res.status(201).json(newTodo);
	} catch (err) {
		res.status(500).json({ error: "Server error" });
	}
});

// DELETE a todo
app.delete("/todos/:id", async (req, res) => {
	try {
		await TodoModel.deleteOne({ _id: req.params.id });
		res.status(200).send("Todo deleted!");
	} catch (err) {
		res.status(500).json({ error: "Server error" });
	}
});

// UPDATE a todo
app.put("/todos/:id", async (req, res) => {
	try {
		const updatedTodo = await TodoModel.findByIdAndUpdate(
			req.params.id,
			{ text: req.body.text },
			{ new: true }
		);
		res.status(200).json(updatedTodo);
	} catch (err) {
		res.status(500).json({ error: "Server error" });
	}
});

// ================== START SERVER ==================
app.listen(port, () => {
	console.log(`🚀 Server: http://localhost:${port}`);
});
