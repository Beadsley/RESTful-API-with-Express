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

// YOUR ENDPOINTS HERE
app.get('/api/presidents', (req, res, next) => {
  if (req.headers['accept'] === 'application/json') {
    res.json(presidents);
  }
  else {
    res.status(400).send('wrong content type');
  }
});

app.get('/api/presidents/:id', (req, res, next) => {
  let id = req.params.id;
  let exists = false;
  if (req.headers['accept'] === 'application/json') { 
    presidents.forEach(president => {
        if (president.id === id){
          exists = true;
          res.json(president);
        }
    });
    if (!exists){
      res.send('Doesnt exist');
    }
    
  }
  else {
    res.status(400).send('wrong content type');
  }
});



module.exports.app = app;
module.exports.db = () => presidents;
module.exports.nextId = () => nextId(presidents);
