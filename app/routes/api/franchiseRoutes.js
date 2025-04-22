const express = require('express')
const router = express.Router()

const { franchiseDao: dao } = require('../../daos/dao')

router.get('/', (req, res)=> {
    dao.findAll(res, dao.table)
})

router.get('/count', (req, res)=> {
    dao.countAll(res, dao.table)
})

router.get('/fran/:franchise', (req, res)=> {
    dao.findHeroesByFranchise(res, dao.table, req.params.franchise)
})

router.get('/:id', (req, res)=> {
    dao.findById(res, dao.table, req.params.id)
})

module.exports = router