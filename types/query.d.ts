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

interface _storeQuery<T> {
    $select?: Array<keyof T>
    $collection?: string
    $ops?: Array<_op<T>>
}

interface _condition { column: string, operator: string, value: string | number| boolean | null }

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

interface _rmField<T> {
    field: keyof T,
    force?: boolean
}

interface _modField<T> {
    from: string
    to: keyof T
}

interface _colSchema<T> {
    collection?: string
    add?: Set<keyof T>
    change?: Array<_modField<T>>
    drop?: Array<_rmField<T>>
}