export type _schema<T> = {
    _id: string | null
} & Omit<T, '_id'>

