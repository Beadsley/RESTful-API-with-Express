const dbHelper = require('./psqlHelper');
const app = require('express')();
// // used to create a table within the postgres database
// const createTableQuery = `
// CREATE TABLE presidents (
//   ID SERIAL PRIMARY KEY,
//   year_from TEXT NOT NULL,
//   date_from TEXT DEFAULT 'not specified',
//   name TEXT NOT NULL
// );
// `
// dbHelper.createTable(createTableQuery);


//dbHelper.getAll();

app.listen(3000, () => {
  console.log("listenening on port 3000 \n http://localhost:3000/api/presidents");

});

app.get('/api/presidents', async (req, res) => {
  try {
    const result = await dbHelper.getAll();
    res.status(200).json(result);
  }
  catch (err) {
    res.status(400).send(err.message);
  }
});


// INSERT INTO presidents (year_from, date_from, name)
//   VALUES ('2010', '2020','jerry'), ('2010','2222', 'george');
