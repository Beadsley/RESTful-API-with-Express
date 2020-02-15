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
app.get('/api/presidents', (req, res) => {

  const contentType = req.headers['accept'];

  if (contentType === 'application/json') {
    res.json(presidents);
  }
  else {
    res.status(400).send('invalid request');
  }
});

// GET ONE
app.get('/api/presidents/:id', (req, res) => {

  const contentType = req.headers['accept'];

  if (contentType === 'application/json') {
    const id = req.params.id;
    const president = getPresident(id);
    if (president) {
      res.json(president);
    }
    else {
      res.status(404).send('Not Found');
    }
  }
  else {
    res.status(400).send('invalid request');
  }
});

// CREATE
// validate data (is a number), contains right info. 
// validate date is not above the current date
// check if president already exists
app.post('/api/presidents', (req, res) => {

  const contentType = req.headers['content-type'];
  const reqData = req.body;
  let data = validateData(reqData)

  if (contentType === 'application/json' && data) {
    const id = nextId(presidents).toString();
    data = Object.assign({ id }, data);
    presidents.push(data);
    res.status(201).json(data);
  }
  else {
    res.status(400).send('invalid request');
  }
});

//check when updating id
app.put('/api/presidents/:id', (req, res) => {

  const contentType = req.headers['content-type'];
  const reqData = req.body;
  let data = validateData(reqData);
  
  if (contentType === 'application/json' && data) {

    const id = req.params.id;
    const index = getPresidentIndex(id);

    if (index !== -1) {
      data = Object.assign({ id }, data);
      updatePresident(index, data)
      res.status(200).send('File updated');
    } else {
      res.status(204).send('File not found');
    }
  }
  else {
    res.status(400).send('invalid request');
  }
});


app.delete('/api/presidents/:id', (req, res) => {

  const id = req.params.id;
  const index = getPresidentIndex(id);

  if (index !== -1) {
    removePresident(index);
    res.status(204).send('File removed');
  } else {
    res.status(404).send('File not found');
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

const validateData = (data) => {

  delete data.id;

  const keys = Object.keys(data)

  if (keys.includes('from' && 'name') && keys.length === 2) {
    const yearOK = validateYear(Number(data.from));
    if (yearOK && typeof data.name === 'string') {
      return {
        from: data.from,
        name: data.name
      }
    }
    else {
      return undefined;
    }
  }
  else if (keys.includes('from' && 'to' && 'name') && keys.length === 3) {
    const yearOK = validateYear(Number(data.from)) && validateYear(Number(data.to));
    if (yearOK && typeof data.name === 'string') {
      return {
        from: data.from,
        to: data.to,
        name: data.name
      }
    }
    else {
      return undefined;
    }
  }
  return undefined
}
// check to is larger than from 
const validateYear = (year) => {

  const currentYear = new Date().getFullYear();

  if (isNaN(year) === true) {
    return false;
  }
  else if (year <= currentYear && year >= 1732) {
    return true;
  }
  else {
    return false;
  }
}


// const pres = {
//   id:222,
//   from: '2000',
//   to: '2020',
//   name: 'Charles Darwin',

// }
// console.log(validateData(pres));


module.exports.app = app;
module.exports.db = () => presidents;
module.exports.nextId = () => nextId(presidents);
