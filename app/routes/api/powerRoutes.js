const express = require('express')
const router = express.Router()

const { powerDao: dao } = require('../../daos/dao')


router.get('/', (req, res)=> {
    dao.findAll(res, dao.table)
})

router.get('/count', (req, res)=> {
    dao.countAll(res, dao.table)
})

router.get('/power/:power', (req, res)=> {
    dao.findHeroesByPower(res, dao.table, req.params.power)
})

router.get('/:id', (req, res)=> {
    dao.findById(res, dao.table, req.params.id)
})

module.exports = router