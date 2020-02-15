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
    // 400 bad request ? ?
    res.status(404).send('Not Found');
  }
});
// GET ONE
app.get('/api/presidents/:id', (req, res, next) => {
  let id = req.params.id;
  if (req.headers['accept'] === 'application/json') {
    const president = getPresident(id);
    if (president) {
      res.json(president);
    }
    else {
      res.status(404).send('Not Found');
    }
  }
  else {
    // 400 bad request ??
    res.status(404).send('Not Found');
  }
});

// CREATE
// validate data (is a number), contains right info. 
// validate date is not above the current date
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
  else if (contentType !== 'application/json') {
    res.status(400).send('Wrong content type');
  }
  else {
    // other status ????
  }

});

//check when updating id
app.put('/api/presidents/:id', (req, res) => {
  let reqData = req.body;
  let id = req.params.id;
  const index = getPresidentIndex(id);
  if (index !== -1) {
      updatePresident(index, reqData)
      res.end();
  } else {
    res.status(204).send('File not found');
  }
});


app.delete('/api/presidents/:id', (req, res) => {
  let id = req.params.id;
  const index = getPresidentIndex(id);
  if (index !== -1) {    
    removePresident(index);
    //presidents.splice(index, 1); // check if this actually deletes
    res.status(204).end(); // is end needed ???     
  } else {
    res.status(204).send('File not found');
  }

});

const getPresident = (id) => {
  return presidents.find(president => president.id === id)
}

const getPresidentIndex = (id) => {
  return presidents.findIndex(president => president.id === id)
}

const updatePresident = (index, data) => {
  presidents.splice(index, 1, data);
}

const removePresident = (index) => {
  presidents.splice(index, 1); 
}
// const id = "44";
// const index = getPresidentIndex(id);
// removePresident(index);
// console.log(presidents);



module.exports.app = app;
module.exports.db = () => presidents;
module.exports.nextId = () => nextId(presidents);
