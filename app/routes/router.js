const express = require('express')
const router = express.Router()
const axios = require('axios')

const port = process.env.port || 3005

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

// get heroCount
let heroCount = 0

axios.get(`http://localhost:${port}/api/hero/count`).then(resp => heroCount = resp.data.count)

endpoints.forEach(endpoint => {
    router.use(`/api/${endpoint}`, require(`./api/${endpoint}Routes`))


})

// home page
router.get('/', (req, res)=> {

    let randomHero = {}
    let message = ''
    const url = `http://localhost:${port}/api/hero`

    axios.get(url)
    .then(resp => {
        randomHero = resp.data[Math.floor(Math.random() * resp.data.length)]

        let heroName = randomHero.hero_name != null ? randomHero.hero_name : `${randomHero.first_name} ${randomHero.last_name}`

        switch (randomHero.alignment) {

            case 'HERO': 
                message = `Great news! ${heroName} is here to save you!`
                break;
            case 'ANTIHERO':
                message = `I guess you need to get on ${heroName}'s good side if you want to live.`
                break;
            case 'VILLAIN':
                message = `Looks like ${heroName} is here to destroy you and everything you love`
                break;
            default:
                    message = ''
                    break;
        }
    
        // console.log(randomHero)
        res.render('pages/home', {
            title: 'Home',
            name: 'My Hero Website',
            randomHero,
            message,
            heroName,
            endpoints
        })

    })

})

// heroForm
router.get('/heroForm', (req, res)=> {
    res.render('pages/heroForm', {
        title: 'Hero Form',
        name: 'Add a hero',
        endpoints,
    })
})

// powerForm
router.get('/powerForm/:heroId',(req, res)=> {
    const heroId = req.params.heroId
    axios.get(`http://localhost:${port}/api/power`)
        .then(resp => {
            res.render('pages/powerForm', {
                title: 'Power Form',
                name: 'Add Powers',
                endpoints,
                heroId,
                powers: resp.data
            })
        })
})

// rivalForm
router.get('/rivalForm/:heroId',(req, res)=> {
    const heroId = req.params.heroId
    axios.get(`http://localhost:${port}/api/hero/sort`)
        .then(resp => {
            res.render('pages/rivalForm', {
                title: 'Rival Form',
                name: 'Add Rivals',
                endpoints,
                heroId,
                rivals: resp.data
            })
        })
})

// imageForm
router.get('/hero-add-image/:hero/:heroId', (req, res)=> {

    const hero = req.params.hero
    const heroId = req.params.heroId

    res.render('pages/imageForm', {
        title: 'Image Form',
        name: 'Add Image',
        hero,
        heroId,
        endpoints
    })
})


for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i]
    if (endpoint == 'hero') {
        router.get(`/${endpoint}`, (req, res)=> {
            const url =  `http://localhost:${port}/api/${endpoint}`

            axios.get(url)
                .then(resp => {
                    res.render('pages/allHero', {
                        title: 'Heroes',
                        name: 'All Heroes',
                        data: resp.data,
                        endpoints
                    })
                })
        })

        router.get(`/${endpoint}/:id`, (req, res)=> {

            const id = req.params.id

            const url = `http://localhost:${port}/api/${endpoint}/${id}`

            axios.get(url)
                .then(resp => {
                    let heroName = resp.data.hero_name == null ? `${resp.data.first_name} ${resp.data.last_name}` : resp.data.hero_name

                    res.render('pages/heroSingle', {
                        title: heroName,
                        name: heroName,
                        data: resp.data,
                        count: heroCount,
                        endpoints
                    })
                })
        })
    } else {
        router.get(`/${endpoint}`, (req, res)=> {

            const url = `http://localhost:${port}/api/${endpoint}`

            axios.get(url)
                .then(resp => {
                    res.render('pages/allData', {
                        title: endpoint,
                        name: `All ${endpoint}`,
                        data: resp.data,
                        endpoints,
                        category: endpoint
                    })
                })
        })

        router.get(`/${endpoint}/:node`, (req, res)=> {

            const node = req.params.node

            const url = `http://localhost:${port}/api/${endpoint}/${endpoint}/${node}`

            axios.get(url)
                .then(resp => {
                    res.render('pages/dataSingle', {
                        title: node,
                        name: node,
                        data: resp.data,
                        endpoints
                    })
                })
        })
    }

    // router.all('/{*any}', (req, res)=> {
    //     // res.send('<h1>404 Error. This Page does not exists.</h1>')
    //     res.render('404 Error', {
    //         title: '404 Error',
    //         name: '404 Error',
    //         endpoints
    //     })
    // })
}




module.exports = router 