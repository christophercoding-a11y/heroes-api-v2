const con = require('../../config/dbconfig')
const { findHeroesByFranchise } = require('./franchiseDao')
const { table } = require('./speciesDao')

const teamDao = {
    table: 'team',

    findHeroesByTeam: (res, table, team)=> {
        con.execute(
            `select h.hero_id, h_hero_name, h.first_name,
            h.last_name, h.alias, f.franchise, s.species,'
            h.place_of_origin, h.first-app, h.alignment, h.img_url
            from hero h
            join franchise f using (franchise_id)
            join species s using (species_id)
            join hero_to_team ht on h.hero_id = ht.hero_id
            join team t on ht.team_id = t.team_id
            where t.team = '${team}'
            order by t.team_id;`,
            (error, rows)=> {
                if (!error) {
                    if (rows.length === 1) {
                        res.json(...rows)
                    } else {
                        res.json(rows)
                    }
                } else {
                    console.log(`Dao Error: ${table}`, error)
                }
            }
        )
    }
}

module.exports = teamDao