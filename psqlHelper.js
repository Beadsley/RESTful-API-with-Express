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
        })
    })
}
const get = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM ${TBNAME} WHERE id = ${id}`, (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results.rows)
            }
        })
    })
}


module.exports = {
    getAll, get, 
    createTable
};