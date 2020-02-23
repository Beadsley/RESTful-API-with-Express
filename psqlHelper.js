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
};

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
};
//sort the list

const getByID = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM ${TBNAME} WHERE id = ${id};`, (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results.rows)
            }
        })
    })
};

const getByName = (name) => {
    
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM ${TBNAME} WHERE name = '${name}';`, (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results.rows)
            }
        })
    })
}

const insert = (from, name, _to) => {
    return new Promise((resolve, reject) => {
        const query = `
        INSERT INTO ${TBNAME} (year_from, year_to, name)
        VALUES ('${from}', '${_to}', '${name}');
        `        
        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results.rows)
            }
        })
    })
};

const update = (id, from, name, _to) => {
    return new Promise((resolve, reject) => {
        const query = `
        UPDATE ${TBNAME} 
        SET year_from = '${from}',
        year_to = '${_to}',
        name = '${name}' 
        WHERE id = ${id};
        `        
        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results.rows)
            }
        })
    })
};

const remove = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
        DELETE FROM ${TBNAME}
        WHERE id = ${id};
        `
        pool.query(query, (error, results) => {
            
            if (error) {
                reject(error);
            }
            else {
                resolve(results)
            }
        })       
    })
};

module.exports = {
    getAll, 
    getByID, 
    insert, 
    update,
    createTable,
    remove,
    getByName,
};
