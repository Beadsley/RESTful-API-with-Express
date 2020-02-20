const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'danielbeadleson',
  host: 'localhost',
  database: 'presidents',
  port: 5432,
});

pool.query('SELECT * FROM books', (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows);
    
    //response.status(200).json(results.rows)
  })