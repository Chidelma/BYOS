import Silo from '../../Stawrij'
import { SILO, _album, albums } from '../data'
import { mkdirSync, rmSync } from 'node:fs'

Silo.configureStorages({})

rmSync(process.env.DATA_PREFIX!, {recursive:true})
mkdirSync(process.env.DATA_PREFIX!, {recursive:true})

const ALBUMS = 'albums'

for(const album of albums.slice(0, 25)) {
    await Silo.putDoc(SILO, ALBUMS, album)
}

// const docs = await Silo.findDocs(ALBUMS, {}).next()

// console.log(docs)

export {}