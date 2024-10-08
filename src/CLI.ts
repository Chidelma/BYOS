#!/usr/bin/env node
import Silo from './Stawrij'

try {

    const SQL = process.argv[process.argv.length - 1]

    const op = SQL.match(/^((?:SELECT|select)|(?:INSERT|insert)|(?:UPDATE|update)|(?:DELETE|delete)|(?:CREATE|create)|(?:ALTER|alter)|(?:DROP|drop)|(?:USE|use))/i)

    if(!op) throw new Error("Missing SQL Operation")

    const res = await Silo.executeSQL(SQL)

    switch(op[0].toUpperCase()) {
        case "USE":
            console.log("Successfully changed database")
            break
        case "CREATE":
            console.log("Successfully created schema")
            break
        case "ALTER":   
            console.log("Successfully modified schema")
            break
        case "DROP":
            console.log("Successfully dropped schema")
            break
        case "SELECT":
            console.log(res)
            break
        case "INSERT":
            console.log(res as _ulid)
            break
        case "UPDATE":
            console.log(`Successfully updated ${res} document(s)`)
            break
        case "DELETE":
            console.log(`Successfully deleted ${res} document(s)`)
            break
        default:
            throw new Error("Invalid Operation: " + op[0])
    }

} catch (e) {
    if(e instanceof Error) console.error(e.message)
}