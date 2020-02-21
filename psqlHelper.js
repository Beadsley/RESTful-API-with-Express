const Pool = require('pg').Pool;
const TBNAME = 'presidents';


const pool = new Pool({
    user: 'danielbeadleson',
    host: 'localhost',
    database: 'postgres',
    port: 5432,
});

const createTable = (query) => {
    pool.query(query, (error, results) => {
        if (error) {
            throw error
        }
        console.log('table created');

    })
}

const getAll = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM ${TBNAME}`, (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results.rows)
            }

            //response.status(200).json(results.rows)
        })
    })
}


module.exports = {
    getAll,
    createTable
};
