const con = require('../../config/dbconfig')

const daoCommon = {

    findAll: (res, table)=> {
        con.execute(
            `select * from ${table};`,
            (error, rows)=> {
                if (!error) {
                    // do stuff
                    if (rows.length === 1) {
                        res.json(...rows)
                    } else {
                        res.json(rows)
                    }
                } else {
                    // do something else
                    console.log('DAO ERROR: ', error)
                }
            }
        )
    },

    findById: (res, table, id)=> {
        con.execute(
            `select * from ${table}, where ${table}_id = ?;`,
            [id],
            (error, rows)=> {
                if (!error) {
                    if (rows.length === 1) {
                        res.json(...rows)
                    } else {
                        res.json(rows)
                    }
                } else {
                    console.log('DAO ERROR: ', error)
                }
            }
        )
    },

    countAll: (res, table)=> {
        con.execute(
            `select count(*) count from ${table};`,
            (error, rows)=> {
                if (!error) {
                    if (rows.length === 1) {
                        res.json(...rows)
                    } else {
                        res.json(rows)
                    }
                } else {
                    console.log('DAO ERROR: ', error)
                }
            }
        )
    }
}

module.exports = daoCommon