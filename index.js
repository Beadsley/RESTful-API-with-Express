const app = require('express')();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');
const dbHelper = require('./dbHelper');

const url = 'mongodb://localhost:27017';
const dbName = 'presidents';
const client = new MongoClient(url, { useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db;

const nextId = (presidents) => {
  const highestId = presidents.reduce((a, c) => c.id > a ? c.id : a, 0);
  return Number.parseInt(highestId) + 1;
};

/**
 * mongod, and mongo to connect to the mongo server
 */
app.listen(3000, () => {
  client.connect(function (err) {
    if (err) {
      console.log(err.message);
      throw err;
    }
    else {
      console.log("listenening on port 3000");
      db = client.db(dbName);

      //dbHelper.removeAll(db, () => { client.close() });
    }
  });
});

app.get('/api/presidents', async (req, res) => {

  const contentType = req.headers['accept'];

  if (contentType === 'application/json') {

    const presidents = await dbHelper.getDocuments(db);
    res.json(presidents);
  }
  else {
    res.status(400).send('Invalid request');
  }
});

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
    res.status(400).send('Invalid request');
  }
});

app.post('/api/presidents', async (req, res) => {

  const contentType = req.headers['content-type'];
  const reqData = req.body;
  let data = validateData(reqData);
  const exists = await presidentExists(reqData.name);

  if (contentType === 'application/json' && data && !exists) {
    dbHelper.insertDocuments(db, data);
    res.status(201).json(data);
  }
  else {
    res.status(400).send('Invalid request');
  }
});

app.put('/api/presidents/:id', async (req, res) => {

  const contentType = req.headers['content-type'];
  const reqData = req.body;
  let data = validateData(reqData);

  if (contentType === 'application/json' && data) {
    const id = req.params.id;
    const index = await getPresidentIndex(id);
    if (index !== -1) {
      const oldname = await getPresident(id).name;
      const newName = reqData.name;
      const exists = await presidentExists(newName);
      if (exists && oldname !== newName) {
        res.status(400).send('President already exists');
      }
      else {        
        updatePresident(id, data);
        res.status(200).send('File updated');
      }
    } else {
      res.status(204).send('File not found');
    }
  }
  else {
    res.status(400).send('Invalid request');
  }
});

app.delete('/api/presidents/:id', async (req, res) => {

  const id = req.params.id;
  const index = await getPresidentIndex(id);

  if (index !== -1) {
    dbHelper.remove(db, id);
    res.status(204).send('File removed');
  } else {
    res.status(404).send('File not found');
  }
});

const getPresident = async (id) => {
  const presidents = await dbHelper.getDocuments(db);
  return presidents.find(president => president.id === id);
}

const getPresidentIndex = async (id) => {
  const presidents = await dbHelper.getDocuments(db);
  return presidents.findIndex(president => president._id.toString() == id);
}


const presidentExists = async (name) => {
  const presidents = await dbHelper.getDocuments(db);
  return presidents.some(president => president.name === name);

}

const updatePresident = async (id, data) => {  
  await dbHelper.updateDocument(db, id, data);
};


const validateData = (data) => {

  const keys = Object.keys(data);

  if (keys.includes('from' && 'name') && keys.length === 2) {
    const yearValid = validateYear(Number(data.from));
    if (yearValid && typeof data.name === 'string') {
      return {
        from: data.from.toString(),
        name: data.name.toString()
      };
    }
    else {
      return undefined;
    }
  }
  else if (keys.includes('from' && 'to' && 'name') && keys.length === 3) {
    const yearValid = validateYear(Number(data.from)) && validateYear(Number(data.to)) && (Number(data.from) < Number(data.to));
    if (yearValid && typeof data.name === 'string') {
      return {
        from: data.from.toString(),
        to: data.to.toString(),
        name: data.name
      };
    }
    else {
      return undefined;
    }
  }
  return undefined;
};

const validateYear = (year) => {

  const firstPresident = 1789;
  const currentYear = new Date().getFullYear();

  if (isNaN(year) === true) {
    return false;
  }
  else if (year <= currentYear && year >= firstPresident) {
    return true;
  }
  else {
    return false;
  }
};

module.exports.app = app;
module.exports.db = () => presidents;
module.exports.nextId = () => nextId(presidents);
