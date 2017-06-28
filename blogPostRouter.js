const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {BlogPosts} = require('./models');



// (title, content, author, publishDate)
BlogPosts.create('title1', 'content1', 'author1', 'publishDate1');
BlogPosts.create('title2', 'content2', 'author2', 'publishDate2');

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});




module.exports = router;
