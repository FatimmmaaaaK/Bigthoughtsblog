// index.js (Backend)

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/blog_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model('Post', PostSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/blog', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.post('/new_post', async (req, res) => {
  const { title, content } = req.body;
  const newPost = new Post({ title, content });
  await newPost.save();
  res.redirect('/');
});

app.get('/blog/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
});

app.put('/blog/:id', async (req, res) => {
  const { title, content } = req.body;
  await Post.findByIdAndUpdate(req.params.id, { title, content });
  res.json({ message: 'Post updated successfully' });
});

app.delete('/blog/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Post deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
