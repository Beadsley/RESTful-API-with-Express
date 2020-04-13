const app = require('express')();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const dbHelper = require('./dbHelper');
const val = require('../validation');
const url = 'mongodb://localhost:27017';
const dbName = 'presidents';
const client = new MongoClient(url, { useUnifiedTopology: true });
let db;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const nextId = (presidents) => {
  const highestId = presidents.reduce((a, c) => c.id > a ? c.id : a, 0);
  return Number.parseInt(highestId) + 1;
};

app.listen(3000, () => {
  client.connect(function (err) {
    if (err) {
      console.log(err.message);
      throw err;
    }
    else {
      console.log("listenening on port 3000");
      db = client.db(dbName);
    }
  });
});

app.get('/api/presidents', async (req, res) => {
  try {
    const presidents = await dbHelper.getDocuments(db);
    res.json(presidents);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.get('/api/presidents/:id', async (req, res) => {
  const id = req.params.id;
  const president = await getPresident(id);

  if (president !== undefined) {
    res.json(president);
  }
  else {
    res.status(400).send({ message: `File with id: ${id} not found` });
  }
});

app.post('/api/presidents', async (req, res) => {
  const contentType = req.headers['content-type'];
  const reqData = req.body;
  let data = val.validateData(reqData);
  const exists = await presidentExists(reqData.name);

  if (contentType === 'application/json' && data && !exists) {
    dbHelper.insertDocuments(db, data);
    res.status(201).json(data);
  }
  else {
    res.status(400).send({ message: 'Invalid request' });
  }
});

app.put('/api/presidents/:id', async (req, res) => {
  const contentType = req.headers['content-type'];
  const reqData = req.body;
  let data = val.validateData(reqData);

  if (contentType === 'application/json' && data) {
    const id = req.params.id;
    const index = await getPresidentIndex(id);

    if (index !== -1) {
      const oldObj = await getPresident(id);
      const newName = reqData.name;
      const exists = await presidentExists(newName);
      if (exists && oldObj.name !== newName) {
        res.status(400).send({ message: `President: '${newName}' already exists` });
      }
      else {
        updatePresident(id, data);
        res.status(200).send(reqData);
      }
    } else {
      res.status(204).send({ message: `File with id: '${id}' not found` });
    }
  }
  else {
    res.status(400).send({ message: 'Invalid request' });
  }
});

app.delete('/api/presidents/:id', async (req, res) => {
  const id = req.params.id;
  const index = await getPresidentIndex(id);

  if (index !== -1) {
    dbHelper.remove(db, id);
    res.status(204).end();
  } else {
    res.status(400).send({ message: `File with id: '${id}' not found` });
  }
});

const getPresident = async (id) => {
  const presidents = await dbHelper.getDocuments(db);
  return presidents.find(president => president._id.toString() === id);
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

module.exports.app = app;
module.exports.db = () => presidents;
module.exports.nextId = () => nextId(presidents);
