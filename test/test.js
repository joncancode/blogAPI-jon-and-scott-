const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);


// describe('GET', () => {

//     it('returns the homepage', (done) =>{
//         chai.request(server)
//             .get('/blog-posts')
//             .end(err, res) => {
//                 res.should.have.status(200)
//                 done();
//             }
//     })
// })


describe('Blog Posts', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list items on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.have.all.keys(
            'id', 'title', 'content', 'author', 'publishDate')
        });
      });
  });

  it('should add a blog post on POST', function() {
    const newPost = {
      title: 'Lorem ip some',
      content: 'foo foo foo foo',
      author: 'Emma Goldman'
    };
    const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));

    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.all.keys(expectedKeys);
        res.body.title.should.equal(newPost.title);
        res.body.content.should.equal(newPost.content);
        res.body.author.should.equal(newPost.author)
      });
  });

  it('should error if POST missing expected values', function() {
    const badRequestData = {};
    return chai.request(app)
      .post('/blog-posts')
      .send(badRequestData)
      .catch(function(res) {
        res.should.have.status(400);
      });
  });

  it('should update blog posts on PUT', function() {

    return chai.request(app)
      // first have to get
      .get('/blog-posts')
      .then(function( res) {
        const updatedPost = Object.assign(res.body[0], {
          title: 'connect the dots',
          content: 'la la la la la'
        });
        return chai.request(app)
          .put(`/blog-posts/${res.body[0].id}`)
          .send(updatedPost)
          .then(function(res) {
            res.should.have.status(204);
          });
      });
  });

  it('should delete posts on DELETE', function() {
    return chai.request(app)
      // first have to get
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`)
          .then(function(res) {
            res.should.have.status(204);
          });
      });
  });

});






// describe('Blog API', function() {

//   before(function() {
//     return runServer();
//   });

//   // although we only have one test module at the moment, we'll
//   // close our server at the end of these tests. Otherwise,
//   // if we add another test module that also has a `before` block
//   // that starts our server, it will cause an error because the
//   // server would still be running from the previous tests.
//   after(function() {
//     return closeServer();
//   });

//   // test strategy:
//   //   1. make request to `/shopping-list`
//   //   2. inspect response object and prove has right code and have
//   //   right keys in response object.
//   it('should list items on GET', function() {
//     // for Mocha tests, when we're dealing with asynchronous operations,
//     // we must either return a Promise object or else call a `done` callback
//     // at the end of the test. The `chai.request(server).get...` call is asynchronous
//     // and returns a Promise, so we just return it.
//     return chai.request(app)
//       .get('/blog-posts')
//       .then(function(res) {
//         res.should.have.status(200);
//         res.should.be.json;
//         res.body.should.be.a('array');

//         // because we create three items on app load
//         res.body.length.should.be.at.least(1);
//         // each item should be an object with key/value pairs
//         // for `id`, `name` and `checked`.
//         const expectedKeys = ['title', 'content', 'author'];
//         res.body.forEach(function(item) {
//           item.should.be.a('object');
//           item.should.include.keys(expectedKeys);
//         });
//       });
//   });

//   // test strategy:
//   //  1. make a POST request with data for a new item
//   //  2. inspect response object and prove it has right
//   //  status code and that the returned object has an `id`
//   it('should add an item on POST', function() {
//     const newItem = {name: 'coffee', checked: false};
//     return chai.request(app)
//       .post('/shopping-list')
//       .send(newItem)
//       .then(function(res) {
//         res.should.have.status(201);
//         res.should.be.json;
//         res.body.should.be.a('object');
//         res.body.should.include.keys('id', 'name', 'checked');
//         res.body.id.should.not.be.null;
//         // response should be deep equal to `newItem` from above if we assign
//         // `id` to it from `res.body.id`
//         res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
//       });
//   });
  

//   // test strategy:
//   //  1. initialize some update data (we won't have an `id` yet)
//   //  2. make a GET request so we can get an item to update
//   //  3. add the `id` to `updateData`
//   //  4. Make a PUT request with `updateData`
//   //  5. Inspect the response object to ensure it
//   //  has right status code and that we get back an updated
//   //  item with the right data in it.
//   it('should update items on PUT', function() {
//     // we initialize our updateData here and then after the initial
//     // request to the app, we update it with an `id` property so
//     // we can make a second, PUT call to the app.
//     const updateData = {
//       name: 'foo',
//       checked: true
//     };

//     return chai.request(app)
//       // first have to get so we have an idea of object to update
//       .get('/shopping-list')
//       .then(function(res) {
//         updateData.id = res.body[0].id;
//         // this will return a promise whose value will be the response
//         // object, which we can inspect in the next `then` back. Note
//         // that we could have used a nested callback here instead of
//         // returning a promise and chaining with `then`, but we find
//         // this approach cleaner and easier to read and reason about.
//         return chai.request(app)
//           .put(`/shopping-list/${updateData.id}`)
//           .send(updateData);
//       })
//       // prove that the PUT request has right status code
//       // and returns updated item
//       .then(function(res) {
//         res.should.have.status(200);
//         res.should.be.json;
//         res.body.should.be.a('object');
//         res.body.should.deep.equal(updateData);
//       });
//   });

//   // test strategy:
//   //  1. GET a shopping list items so we can get ID of one
//   //  to delete.
//   //  2. DELETE an item and ensure we get back a status 204
//   it('should delete items on DELETE', function() {
//     return chai.request(app)
//       // first have to get so we have an `id` of item
//       // to delete
//       .get('/shopping-list')
//       .then(function(res) {
//         return chai.request(app)
//           .delete(`/shopping-list/${res.body[0].id}`);
//       })
//       .then(function(res) {
//         res.should.have.status(204);
//       });
//   });
// });