const dbHelper = require('./psqlHelper');
const app = require('express')();
const bodyParser = require('body-parser');
const val = require('./validation');

// // used to create a table within the postgres database
// const createTableQuery = `
// CREATE TABLE presidents (
//   ID SERIAL PRIMARY KEY,
//   year_from TEXT NOT NULL,
//   year_to TEXT DEFAULT 'not specified',
//   name TEXT NOT NULL
// );
// `
// dbHelper.createTable(createTableQuery);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("listenening on port 3000 \n http://localhost:3000/api/presidents");

});

app.get('/api/presidents', async (req, res) => {

  try {
    const result = await dbHelper.getAll();
    res.status(200).json(result);
  }
  catch (err) {
    res.status(400).send({ error: err.message });
  }
});


app.get('/api/presidents/:id', async (req, res) => {

  const id = req.params.id;

  try {
    const president = await dbHelper.getByID(id);
    if (president.length !== 0) {
      res.status(200).json(president);
    }
    else {
      res.status(204).send({ message: `File with id: ${id} not found`});
    }
  }
  catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.post('/api/presidents', async (req, res) => {

  const contentType = req.headers['content-type'];
  const reqData = req.body;
  let data = val.validateData(reqData);

  if (contentType === 'application/json' && data) {

    let president = await dbHelper.getByName(data.name);

    if (president.length === 0) {
      try {
        const result = await dbHelper.insert(reqData.from, reqData.name, reqData.to);
        res.status(200).json(reqData);
      }
      catch (err) {
        res.status(400).send({ message: err.message });
      }
    }
    else {
      res.status(400).send({ message: `President: '${reqData.name}' already exists`});
    }

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
    const president = await dbHelper.getByID(id);

    if (president.length !== 0) {
      
      const oldName = president[0].name;
      const newName = reqData.name;
      const exists = await dbHelper.getByName(newName);      

      if (exists.length !== 0 && oldName !== newName) {
        res.status(400).send({ message: `President: '${newName}' already exists`});
      }
      else {
        try {
          const result = await dbHelper.update(id, reqData.from, reqData.name, reqData.to);
          res.status(200).json(reqData);
        }
        catch (err) {
          res.status(400).send({ message: err.message });
        }
      }
    } else {
      res.status(204).send({ message: `File with id: '${id}' not found`});
    }
  }
  else {
    res.status(400).send({ message: 'Invalid request' });
  }
});

app.delete('/api/presidents/:id', async (req, res) => {

  const id = req.params.id;
  const president = await dbHelper.getByID(id);

  if (president.length !== 0) {
    try{
      const results = await dbHelper.remove(id);
      res.status(204).end();    
    }
    catch(err){
      res.status(400).send({ message: err.message });
    }
  }
  else {
    res.status(400).send({ message: 'Invalid request' });
  }
});
