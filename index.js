const app = require('express')();
let presidents = [
  {
    id: '43',
    from: '2001',
    to: '2009',
    name: 'George W. Bush'
  },
  {
    id: '44',
    from: '2009',
    to: '2017',
    name: 'Barack Obama'
  },
  {
    id: '45',
    from: '2017',
    name: 'Donald Trump'
  }
];

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const nextId = (presidents) => {
  const highestId = presidents.reduce((a, c) => c.id > a ? c.id : a, 0);
  return Number.parseInt(highestId) + 1;
};

// GET ALL
app.get('/api/presidents', (req, res, next) => {
  if (req.headers['accept'] === 'application/json') {
    res.json(presidents);
  }
  else {
    // 400 bad requesta
    res.status(400).send('wrong content type');
  }
});
// GET ONE
app.get('/api/presidents/:id', (req, res, next) => {
  let id = req.params.id;
  let exists = false;
  if (req.headers['accept'] === 'application/json') {
    presidents.forEach(president => {
      if (president.id === id) {
        exists = true;
        res.json(president);
      }
    });
    if (!exists) {
      // 404 not found
      res.status(404).send('Not Found');
    }

  }
  else {
    // 400 bad request
    res.status(400).send('Bad Request');
  }
});

// CREATE
// validate data (is a number), contains right info. 
// check if president already exists
app.post('/api/presidents', (req, res, next) => {
  let reqData = req.body;
  const contentType = req.headers['content-type'];
  
  if (contentType === 'application/json') {
    const id = nextId(presidents).toString();
    const data = Object.assign({ id }, reqData);
    presidents.push(data);
    res.json(data);
  }
  else {
    res.status(400).send('Wrong content type');
  }
  
});

module.exports.app = app;
module.exports.db = () => presidents;
module.exports.nextId = () => nextId(presidents);
