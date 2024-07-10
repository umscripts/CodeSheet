require('dotenv').config();
const config = require('./config.json');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const User = require('./models/userModel');
const Note = require('./models/noteModel');

const app = express();

const jwt = require('jsonwebtoken');
const { authenticationToken } = require('./utilities');

app.use(express.json());
app.use(cors({ origin: "*" }));

mongoose.connect(config.connnectionString);

app.listen(8000);
app.get('/', (req, res) => {
    res.json({ data: "Hello" });
});

app.post('/create-account', async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName) {
        return res
            .status(400)
            .json({ error: true, message: "Please provide full name" });
    }
    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: "Please enter email" });
    }
    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Please enter password" });
    }
    const isUser = await User.findOne({ email: email });
    if (isUser) {
        return res.json({
            error: true,
            message: "User already exist"
        });
    }
    const user = new User({
        fullName,
        email,
        password
    });
    await user.save();
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '36000m' });
    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registered successfully"
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res
            .status(400)
            .json({ message: "Please enter email" });
    }
    if (!password) {
        return res
            .status(400)
            .json({ message: "Please enter password" });
    }
    const userInfo = await User.findOne({ email: email });
    if (!userInfo) {
        return res
            .status(400)
            .json({ message: "User not found" });
    }
    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '36000m' });
        return res.json({
            error: false,
            message: "Logged in successfully",
            email,
            accessToken
        });
    } else {
        return res
            .status(400)
            .json({ error: true, message: "Invalid credentials" });
    }
});

app.get('/get-user', authenticationToken, async (req, res) => {
    // Assuming `req.user` is correctly set up by the `authenticationToken` middleware
    const user = req.user;  // Use directly `req.user`

    try {
        const isUser = await User.findOne({ _id: user._id });
        if (!isUser) {
            return res.status(404).json({ error: true, message: "User not found" });
        }
        return res.json({
            user: { fullName: isUser.fullName, email: isUser.email, _id: isUser._id, createdOn: isUser.createdOn },
            message: ""
        });
    } catch (error) {
        console.error("Error in get-user API:", error);
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
            detail: error.message  // Providing more detail can help in debugging
        });
    }
});


app.post('/add-note', authenticationToken, async (req, res) => {
    const { title, content, tags } = req.body;

    if (!title) {
        return res.status(400).json({ error: true, message: "Please provide title" });
    }
    if (!content) {
        return res.status(400).json({ error: true, message: "Please provide content" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: req.user._id  // Assuming req.user is correctly set up by the middleware
        });
        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note added successfully"
        });
    } catch (error) {
        console.error("Error in adding note:", error);
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
            detail: error.message
        });
    }
});

app.put('/edit-note/:noteId', authenticationToken, async (req, res) => {
    const { noteId } = req.params;  // Corrected destructuring
    const { title, content, tags, isPinned } = req.body;
    const user = req.user;  // Assuming req.user directly holds the user object

    if (!title && !content && !tags && isPinned === undefined) { // Check if isPinned is explicitly passed, even as false
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // Update note fields if provided
        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;
        if (tags !== undefined) note.tags = tags;
        if (isPinned !== undefined) note.isPinned = isPinned; // Correct handling of boolean

        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note updated successfully"
        });
    } catch (error) {
        console.error("Error in updating note:", error);
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
            detail: error.message
        });
    }
});

app.get('/get-all-notes/', authenticationToken, async (req, res) => {
    const user = req.user;
    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({
            error: false,
            notes,
            message: "All Notes fetched successfully"
        });
    } catch (error) {
        console.error("Error in fetching all notes:", error);
        return res.status(500).json({
            error: true,
            message: "Something went wrong"
        });
    }
});

app.delete('/delete-note/:noteId', authenticationToken, async (req, res) => {
    const { noteId } = req.params;
    const user = req.user;  // Make sure this is correctly deriving the user object from the token.

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }
        // Using deleteOne directly on the found document instance.
        await note.deleteOne();
        return res.json({
            error: false,
            message: "Note deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleting note:", error);
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
            detail: error.message  // Providing more detail can help in debugging
        });
    }
});

app.put('/update-note-pinned/:noteId', authenticationToken, async (req, res) => {
    const { noteId } = req.params;  // Corrected destructuring
    const { isPinned } = req.body;
    const user = req.user;  // Assuming req.user directly holds the user object

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // Update note fields if provided
        note.isPinned = isPinned; // Correct handling of boolean

        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note updated successfully"
        });
    } catch (error) {
        console.error("Error in updating note:", error);
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
            detail: error.message
        });
    }
});
app.get('/search-notes/', authenticationToken, async (req, res) => {
    const user = req.user;
    const { query } = req.query;
    if (!query) {
        return res
            .status(400)
            .json({ error: true, message: "Please provide search query" });
    }
    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, 'i') } },
                { content: { $regex: new RegExp(query, 'i') } }
            ],
        });
        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes fetched successfully"
        });
    } catch (error) {
        console.error("Error in searching notes:", error);
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
            detail: error.message  // Providing more detail can help in debugging
        });
    }
});


module.exports = app;