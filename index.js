const app = require('express')();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');

const url = 'mongodb://localhost:27017';
const dbName = 'presidents';
const client = new MongoClient(url, { useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

      //removeDocument(db, () => { client.close() });

      getDocuments().then(x => {
        console.log(x);
      });



    }
  });
});

const insertDocuments = function (obj) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertOne(
    obj
    , function (err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      assert.equal(1, result.ops.length);
      console.log("Inserted document into the collection");
    });
}


const getDocuments = () => {
 return new Promise((resolve, reject) => {
    const collection = db.collection('documents');
    collection.find({}).toArray(function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  })
}

// TODO use promises instead of callbacks
const findDocuments = function (callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs.length)
    callback(docs);
  });
}


const removeDocument = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Delete document where a is 3
  collection.deleteMany({}, function (err, result) {
    assert.equal(err, null);
    console.log("Removed everything");
    callback(result);
  });
}


app.get('/api/presidents', async (req, res) => {

  const contentType = req.headers['accept'];

  if (contentType === 'application/json') {
    const presidents = await getDocuments();
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

app.post('/api/presidents', (req, res) => {

  const contentType = req.headers['content-type'];
  const reqData = req.body;
  let data = validateData(reqData);
  const exists = presidentExists(reqData.name);

  if (contentType === 'application/json' && data && !exists) {
    const id = nextId(presidents).toString();
    data = Object.assign({ id }, data);
    insertDocuments(data);
    res.status(201).json(data);
  }
  else {
    res.status(400).send('Invalid request');
  }
});

app.put('/api/presidents/:id', (req, res) => {

  const contentType = req.headers['content-type'];
  const reqData = req.body;
  let data = validateData(reqData);

  if (contentType === 'application/json' && data) {
    const id = req.params.id;
    const index = getPresidentIndex(id);
    if (index !== -1) {
      const oldname = getPresident(id).name;
      const newName = reqData.name;
      const exists = presidentExists(newName);
      if (exists && oldname !== newName) {
        res.status(400).send('President already exists');
      }
      else {
        data = Object.assign({ id }, data);
        updatePresident(index, data);
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

const getPresident = (id) => presidents.find(president => president.id === id);

const getPresidentIndex = (id) => presidents.findIndex(president => president.id === id);

const presidentExists = (name) => presidents.some(president => president.name === name);

const updatePresident = (index, data) => {
  presidents.splice(index, 1, data);
};

const removePresident = (index) => {
  presidents.splice(index, 1);
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
