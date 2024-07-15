type _uuid = `${string}-${string}-${string}-${string}-${string}`

type _storeCursor<T> = {
    [Symbol.asyncIterator](): AsyncGenerator<Map<_uuid, T> | Map<_uuid, Partial<T>> | _uuid, void, unknown>
    next(limit?: number): Promise<Map<_uuid, T> | Map<_uuid, Partial<T>> | _uuid[]>
    onDelete(): AsyncGenerator<_uuid, void, unknown>
}

type _treeItem<T> = {
    field: keyof T
    type?: 'string' | 'number' | 'boolean' | 'string | null' | 'number | null',
    default?: string | number | boolean | null
    children?: _treeItem<T>[]
}

interface _operand {
    $eq?: any
    $ne?: any
    $gt?: number
    $lt?: number
    $gte?: number
    $lte?: number
    $like?: string
}

type _op<T> = Partial<Record<keyof T, _operand>>

type _storeQuery<T> = {
    $select?: Array<keyof T>
    $collection?: string
    $ops?: Array<_op<T>>
}

type _condition = { column: string, operator: string, value: string | number| boolean | null }

type _storeUpdate<T> = {
    [K in keyof Partial<T>]: T[K]
} & {
    $collection?: string
    $where?: _storeQuery<T>
}

type _storeDelete<T> = _storeQuery<T>

type _storeInsert<T> = {
    [K in keyof T]: T[K]
} & {
    $collection?: string
}

type _rmField<T> = {
    field: keyof T,
    force?: boolean
}

type _modField<T> = {
    from: string
    to: keyof T
}

type _colSchema<T> = {
    collection?: string
    add?: Set<keyof T>
    change?: Array<_modField<T>>
    drop?: Array<_rmField<T>>
}