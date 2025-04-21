const express = require('express')
const router = express.Router()
const port = process.env.PORT || 3000

router.use(express.static('public'))

// Root Route => localhost:3000/api
router.get('/api', (req, res)=> {
    res.json({
        'Heroes': `http://localhost:${port}/api/hero`,
        'Franchises': `http://localhost:${port}/api/franchise`,
        'Powers': `http://localhost:${port}/api/power`,
        'Species': `http://locahost:${port}/api/species`,
        'Teams': `http://localhost:${port}/api/team`
    })
})

const endpoints = [
    'hero'
]

endpoints.forEach(endpoint => {
    router.use(`/api/${endpoint}`, require(`./api/${endpoint}Routes`))
})

module.exports = router 