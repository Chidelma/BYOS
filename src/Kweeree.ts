export default class {

    static getExprs<T extends Record<string, any>>(query: _storeQuery<T>, collection?: string) {

        let exprs = new Set<string>()

        try {

            if(query.$ops) {

                for(const op of query.$ops) {

                    for(const column in op) {

                        const col = op[column as keyof T]!

                        const prefix = `${collection ?? query.$collection}/${column}`

                        if(col.$eq) exprs = new Set([...exprs, `${prefix}/${col.$eq}/**/*`])
                        if(col.$ne) exprs = new Set([...exprs, `${prefix}/!(${col.$ne})/**/*`])
                        if(col.$gt) {
                            const valOp = this.getGtOp(String(col.$gt).split('').map((n) => Number(n)))
                            exprs = new Set([...exprs, `${prefix}/${valOp}/**/*`])
                        }
                        if(col.$gte) {
                            const valOp = this.getGteOp(String(col.$gte).split('').map((n) => Number(n)))
                            exprs = new Set([...exprs, `${prefix}/${valOp}/**/*`])
                        }
                        if(col.$lt) {
                            const valOp = this.getLtOp(String(col.$lt).split('').map((n) => Number(n)))
                            exprs = new Set([...exprs, `${prefix}/${valOp}/**/*`])
                        }
                        if(col.$lte) {
                            const valOp = this.getLteOp(String(col.$lte).split('').map((n) => Number(n)))
                            exprs = new Set([...exprs, `${prefix}/${valOp}/**/*`])
                        }
                        if(col.$like) exprs = new Set([...exprs, `${prefix}/${col.$like.replaceAll('%', '*')}/**/*`])
                    }
                }

            } else exprs = new Set([`${collection ?? query.$collection}/**/*`])

        } catch(e) {
            if(e instanceof Error) throw new Error(`Query.getExprs -> ${e.message}`)
        }

        return Array.from(exprs)
    }

    private static getGtOp(numbers: number[], negate: boolean = false) {

        let expression = ''

        for(const num of numbers) expression += negate ? `[!${num < 9 ? num + 1 : 9}-9]` : `[${num < 9 ? num + 1 : 9}-9]`

        return expression
    }

    private static getGteOp(numbers: number[], negate: boolean = false) {

        let expression = ''

        for(const num of numbers) expression += negate ? `[!${num < 9 ? num : 9}-9]` : `[${num < 9 ? num : 9}-9]`

        return expression
    }

    private static getLtOp(numbers: number[], negate: boolean = false) {

        let expression = ''

        for(const num of numbers) expression += negate ? `[!0-${num < 9 ? num - 1 : 9}]` : `[0-${num < 9 ? num - 1 : 9}]`

        return expression
    }

    private static getLteOp(numbers: number[], negate: boolean = false) {

        let expression = ''

        for(const num of numbers) expression += negate ? `[!0-${num < 9 ? num : 9}]` :  `[0-${num < 9 ? num : 9}]`

        return expression
    }
}