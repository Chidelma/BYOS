type _uuid = `${string}-${string}-${string}-${string}-${string}`

type _schema = "STRICT" | "LOOSE"

interface _storeCursor<T> {
    [Symbol.asyncIterator](): AsyncGenerator<Map<_uuid, T> | Map<_uuid, Partial<T>> | _uuid, void, unknown>
    collect(): Promise<Map<_uuid, T> | Map<_uuid, Partial<T>> | _uuid[]>
    onDelete(): AsyncGenerator<_uuid, void, unknown>
}