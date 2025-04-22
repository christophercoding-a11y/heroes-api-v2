const con = require('../../config/dbconfig')

const heroDao = {
    table: 'hero',

    findHeroes: (res, table)=> {
        con.execute(
            `select ${table}.hero_id, ${table}.hero_name, ${table}.first_name,
            ${table}.last_name, ${table}.alias, f.franchise, s.species, 
            ${table}.place_of_origin, ${table}.first_app, ${table}.alignment, ${table}.img_url
            from ${table}
            join franchise f using (franchise_id)
            join species s using (species_id)
            order by ${table}.hero_id;`,
            (error, rows)=> {
                if (!error) {
                    if (rows.length === 1) {
                        res.json(...rows)
                    } else {
                        res.json(rows)
                    }
                } else {
                    console.log('Hero Dao Error: ', error)
                }
            }
        )
    },

    findHeroById: (res, table, id)=> {
        let powers = []
        let rivals = []

        con.execute(
            `select h.hero_id, p.power
            from hero h
            join hero_to_power hp on h.hero_id = hp.hero_id
            join power p on p.power_id = hp.power_id
            where h.hero_id = ${id};`,
            (error, rows)=> {
                if (!error) {
                    Object.values(rows).forEach(obj => {
                        powers.push(obj.power)
                    })
                    con.execute(
                        `select h1.hero_name hero, 
                        case when h1.hero_name is null then concat(h1.first_name, ' ', h1.last_name)
                        else h1.hero_name
                        end hero,
                        case when h2.hero_name is null then concat(h2.first_name, ' ', h2.last_name)
                        else h2.hero_name
                        end rival
                        FROM hero_to_rival hr 
                        join hero h1 on h1.hero_id = hr.hero_id
                        join hero h2 on h2.hero_id = hr.rival_id
                        where h1.hero_id = ${id};`,
                        (error, rows)=> {
                            if (!error) {
                                Object.values(rows).forEach(obj => {
                                    rivals.push(obj.rival)
                                })

                                con.execute(
                                    `select h.hero_id, 
                                    h.hero_name, h.first_name,
                                    h.last_name, h.alias, 
                                    f.franchise, s.species, h.place_of_origin, 
                                    h.first_app, h.alignment, h.img_url
                                    from hero h
                                    join franchise f using (franchise_id)
                                    join species s using (species_id)
                                    WHERE h.hero_id = ${id};`,
                                    (error, rows)=> {
                                        rows.forEach(row => {
                                            row.powers = powers
                                            row.rivals = rivals
                                        })

                                        if (!error) {
                                            if (rows.length === 1) {
                                                res.json(...rows)
                                            } else {
                                                res.json(rows)
                                            }
                                        } else {
                                            console.log(`DAO Error: ${table} `, error)
                                        }
                                    }
                                )
                            }
                        }
                    )
                } else {
                    console.log(error)
                }
            }
        )
    },

    findByAlignment:(res, table, alignment)=> {
        con.execute(
            `select ${table}.hero_id, ${table}.hero_name, ${table}.first_name,
            ${table}.last_name, ${table}.alias, f.franchise, s.species, 
            ${table}.place_of_origin, ${table}.first_app, ${table}.alignment, ${table}.img_url
            from ${table}
            join franchise f using (franchise_id)
            join species s using (species_id)
            where ${table}.alignment = '${alignment}'
            order by ${table}.hero_id;`,
            (error, rows)=> {
        
                if (!error) {
                    if (rows.length === 1) {
                        res.json(...rows)
                    } else {
                        res.json(rows)
                    }
                } else {
                    console.log(`DAO Error: ${table} `, error)
                }
            }
        )
    },
    sort: (res, table)=> {
        con.execute(
            `select ${table}.hero_id, ${table}.hero_name, ${table}.first_name,
            ${table}.last_name, ${table}.alias, f.franchise, s.species, 
            ${table}.place_of_origin, ${table}.first_app, ${table}.alignment, ${table}.img_url
            from ${table}
            join franchise f using (franchise_id)
            join species s using (species_id)
            order by ${table}.hero_name, ${table}.last_name, ${table}.first_name;`,
            (error, rows)=> {
                if (!error) {
                    if (rows.length === 1) {
                        res.json(...rows)
                    } else {
                        res.json(rows)
                    }
                } else {
                    console.log('Hero Dao Error: ', error)
                }
            }
        )
    }
}

module.exports = heroDao