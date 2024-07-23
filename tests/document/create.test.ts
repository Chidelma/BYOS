import { test, expect, describe } from 'bun:test'
import Silo from '../../src/Stawrij'
import { albums, posts } from '../data'
import { mkdirSync, rmSync } from 'node:fs'

rmSync(process.env.DATA_PREFIX!, {recursive:true})
mkdirSync(process.env.DATA_PREFIX!, {recursive:true})

describe("NO-SQL", () => {

    test("PUT", async () => {

        await Silo.createSchema('posts')

        await Silo.bulkDataPut<_post>('posts', posts.slice(0, 25))

        const results = await Silo.findDocs<_post>('posts').collect() as Map<_uuid, _post>

        expect(results.size).toEqual(25)

    })
})

const ALBUMS = 'albums'

describe("SQL", () => {

    test("INSERT", async () => {

        await Silo.createSchema(ALBUMS)

        for(const album of albums.slice(0, 25)) {

            const keys = Object.keys(album)
            const values = Object.values(album).map(val => JSON.stringify(val))

            await Silo.executeSQL<_album>(`INSERT INTO ${ALBUMS} (${keys.join(',')}) VALUES (${values.join('\\')})`)
        }

        const cursor = await Silo.executeSQL<_album>(`SELECT * FROM ${ALBUMS}`) as _storeCursor<_album>

        const results = await cursor.collect() as Map<_uuid, _album>

        expect(results.size).toEqual(25)

    })
})