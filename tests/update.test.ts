import { test, expect, describe } from 'bun:test'
import Silo from '../src/Stawrij'
import { _photo, photos, _todo, todos } from './data'
import { mkdirSync, rmSync } from 'node:fs'
import { _uuid, _storeCursor } from '../src/types/general'  

//rmSync(process.env.DATA_PREFIX!, {recursive:true})

//mkdirSync(process.env.DATA_PREFIX!, {recursive:true})

describe("NO-SQL", async () => {

    const PHOTOS = 'photos'

    await Silo.bulkPutDocs<_photo>(PHOTOS, photos.slice(0, 25))

    test("UPDATE ONE", async () => {

        const ids = await Silo.findDocs<_photo>(PHOTOS, {}, true).next(1) as _uuid[]

        await Silo.patchDoc<_photo>(PHOTOS, new Map([[ids[0], { title: "All Mighty" }]]))

        const results = await Silo.findDocs<_photo>(PHOTOS, { $ops: [{ title: { $eq: "All Mighty" } }]}).next() as Map<_uuid, _photo>
        
        expect(results.size).toBe(1)
    })

    test("UPDATE CLAUSE", async () => {

        const count = await Silo.patchDocs<_photo>(PHOTOS, { title: "All Mighti", $where: { $ops: [{ title: { $like: "%est%" } }] } })

        const results = await Silo.findDocs<_photo>(PHOTOS, { $ops: [ { title: { $eq: "All Mighti" } } ] }).next() as Map<_uuid, _photo>
        
        expect(results.size).toBe(count)
    })

    test("UPDATE ALL", async () => {

        const count = await Silo.patchDocs<_photo>(PHOTOS, { title: "All Mighter", $where: {} })

        const results = await Silo.findDocs<_photo>(PHOTOS, { $ops: [ { title: { $eq: "All Mighter" } } ] }).next() as Map<_uuid, _photo>
        
        expect(results.size).toBe(count)
    }, 60 * 60 * 1000)
})

describe("SQL", async () => {

    const TODOS = 'todos'

    for(const todo of todos.slice(0, 25)) {

        const keys = Object.keys(todo)
            
        const params: Map<keyof _todo, any> = new Map()
        const values: any[] = []

        Object.values(todo).forEach((val, idx) => {
            if(typeof val === 'object') {
                params.set(keys[idx] as keyof _todo, val)
                values.push(keys[idx])
            } else if(typeof val === 'string') {
                values.push(`'${val}'`)
            } else values.push(val)
        })

        await Silo.executeSQL<_todo>(`INSERT INTO ${TODOS} (${keys.join(',')}) VALUES (${values.join(',')})`, params)
    }

    test("UPDATE CLAUSE", async () => {

        const count = await Silo.executeSQL<_todo>(`UPDATE ${TODOS} SET title = 'All Mighty' WHERE title LIKE '%est%'`) as number

        const cursor = await Silo.executeSQL<_todo>(`SELECT * FROM ${TODOS} WHERE title = 'All Mighty'`) as _storeCursor<_todo>
        
        const results = await cursor.next() as Map<_uuid, _todo>
        
        expect(results.size).toBe(count)
    })

    test("UPDATE ALL", async () => {

        const count = await Silo.executeSQL<_todo>(`UPDATE ${TODOS} SET title = 'All Mightier'`) as number

        const cursor = await Silo.executeSQL<_todo>(`SELECT * FROM ${TODOS} WHERE title = 'All Mightier'`) as _storeCursor<_todo>
        
        const results = await cursor.next() as Map<_uuid, _todo>
        
        expect(results.size).toBe(count)
    }, 60 * 60 * 1000)
})