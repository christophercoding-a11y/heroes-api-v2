const express = require('express')
const router = express.Router()
const axios = require('axios')
const port = process.env.port || 3000

router.use(express.static('public'))

// Root Route => localhost:3000/api
router.get('/api', (req, res)=> {
    res.json({
        'Heroes': `http://localhost:${port}/api/hero`,
        'Franchises': `http://localhost:${port}/api/franchise`,
        'Powers': `http://localhost:${port}/api/power`,
        'Species': `http://localhost:${port}/api/species`,
        'Teams': `http://localhost:${port}/api/team`
    })
})

const endpoints = [
    'hero',
    'power',
    'species',
    'franchise',
    'team'
]

endpoints.forEach(endpoint => {
    router.use(`/api/${endpoint}`, require(`./api/${endpoint}Routes`))
})

// home page
router.get('/', (req, res)=> {
    res.render('pages/home', {
        title: 'Home',
        name: 'My Hero Website'
    })
})

// hero page => localhost:3000/heroes
router.get('/heroes', (req, res)=> {

    // make our fetch call
    const url = `http://localhost:${port}/api/hero`

    axios.get(url).then(resp => {
        res.render('pages/allHero', {
            title: 'All Heroes',
            name: 'All Heroes ... and some Villains',
            data: resp.data
        })
    })
})

module.exports = router 