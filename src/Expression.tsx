export namespace Operand {
    export namespace Sign {
        export type t = '+' | '-'
    }

    export namespace Digit {
        export type t = number | '.' | Sign.t
    }

    export type t = readonly Digit.t[]

    export const create: () => t = () => {
        return []
    }

    export const containsDecimal: (t: t) => boolean = (t) => {
        return t.find(el => el === '.') !== undefined
    }

    export const addDigit: (t: t, digit: Digit.t) => t = (t, digit) => {
        // 0 is first digit added to operand
        if (digit === 0 && t.length === 0) {
            // Do nothing
            return t
        } else if (containsDecimal(t) && digit === '.') {
            // Do not add a decimal if there already is one
            return t
        } else {
            return [...t, digit]
        }
    }

    export const toString: (t: t) => string = (t) => {
        return t.join("")
    }

    export const toNumber: (t: t) => number = (t) => {
        if (t.length === 0) {
            return 0
        }
        return +toString(t)
    }

    export const empty: (t: t) => t = (t) => {
        return []
    }

    export const noDigits: (t: t) => boolean = (t) => {
        return t.every(op => typeof op !== 'number') || t.length === 0
    }

    export const isEmpty: (t: t) => boolean = (t) => {
        return t.length === 0
    }
}

namespace Expression {
    export namespace Operator {
        export const all = ['+', '-'] as const

        export type t = typeof all[number]

        export const compute: (t: t, a: number, b: number) => number = (t, a, b) => {
            const match = {
                '+': a + b,
                '-': a - b
            }
            return match[t]
        }
    }

    export namespace Element {
        export type t = number | Operator.t

        export const isOperatorType: (t: t) => boolean = (t: t) => {
            return (typeof (t) !== 'number')
        }
    }

    export type t = readonly Element.t[]

    export const create: () => t = () => {
        return []
    }

    export const addElement: (t: t, element: Element.t) => t = (t, element) => {
        return [...t, element]
    }

    export const toString: (t: t) => string = (t) => {
        return t.join(" ")
    }

    export const isEmpty: (t: t) => boolean = (t) => { return t.length === 0 }

    export const empty: (t: t) => t = (t) => { return [] }

    export const evaluate: (t: t) => t = (t) => {
        let operator: Operator.t | undefined = undefined
        let result: Element.t | undefined = t.at(0)

        if (result === undefined) {
            return t
        } else if (Element.isOperatorType(result)) {
            throw new Error("Invalid expression with leading operator")
        }
        // Safe to cast after validation above
        result = result as number

        for (let element of t) {
            if (Element.isOperatorType(element)) {
                operator = element as Operator.t
            } else {
                if (operator) {
                    result = Operator.compute(operator, result, element as number)
                } else {
                    result = element as number
                }
            }
        }
        return [result]
    }

    export const containsOperator: (t: t) => boolean = (t) => {
        return t.find(el => Element.isOperatorType(el)) !== undefined
    }
}

export default Expression