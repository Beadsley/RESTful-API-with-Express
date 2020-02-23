const dbHelper = require('./psqlHelper');
const app = require('express')();
const bodyParser = require('body-parser');

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
    const result = await dbHelper.get(id);
    if (result.length !== 0) {
      res.status(200).json(result);
    }
    else {
      res.status(404).send({ message: 'Not Found' });
    }
  }
  catch (err) {
    res.status(400).send({ error: err.message });
  }
});
//no spaces between names
app.post('/api/presidents', async (req, res) => {

  const reqData = req.body;

  try {
    const result = await dbHelper.insert(reqData.from, reqData.name, reqData.to);
    res.status(200).json(reqData);
  }
  catch (err) {
    res.status(400).send(err.message);
  }
});

app.put('/api/presidents/:id', async (req, res) => {

  const id = req.params.id;
  const reqData = req.body;

  try {
    const result = await dbHelper.update(id, reqData.from, reqData.name, reqData.to);
    res.status(200).json(result);
  }
  catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/api/presidents/:id', async (req, res) => {



  const id = req.params.id;

  const results = await dbHelper.remove(id);
  console.log(results);
  res.status(204).end();


});
