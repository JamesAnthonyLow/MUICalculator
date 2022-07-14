import { Dispatch, SetStateAction } from 'react'
import Expression, { Operand } from './Expression'

namespace State {
    export type t = {
        operand: Operand.t,
        expression: Expression.t,
        setState: (t: t) => void,
    }

    export const create: (stateManager: (initialState: any) => [any, Dispatch<SetStateAction<any>>]) => t = (stateManager) => {
        const [operand, setOperand] = stateManager(Operand.create())
        const [expression, setExpression] = stateManager(Expression.create())
        const setState: (t: t) => void = (t) => {
            setOperand(t.operand);
            setExpression(t.expression);
        }
        return { operand, expression, setState }
    }

    export const onDigitClick: (t: t, character: Operand.Digit.t) => void = (t, character) => {
        if (!Expression.containsOperator(t.expression)) {
            t.expression = Expression.empty(t.expression)
            t.setState(t)
        }
        t.operand = Operand.addDigit(t.operand, character)
        t.setState(t)
    }

    export const onOperatorClick: (t: t, character: (Expression.Operator.t | Operand.Sign.t)) => void = (t, character) => {
        if (Operand.noDigits(t.operand) && Expression.isEmpty(t.expression)) {
            // Operator entered first is interpreted as a "sign" of the operand
            let operand = Operand.empty(t.operand)
            if (Operand.Sign.all.find(s => s === character) !== undefined) {
                t.operand = Operand.addDigit(operand, character)
            }
        } else {
            let expression = t.expression
            if (!Operand.isEmpty(t.operand)) {
                expression = Expression.addElement(t.expression, Operand.toNumber(t.operand))
            }
            t.operand = Operand.empty(t.operand)
            if (!Expression.containsOperator(expression)) {
                t.expression = Expression.addElement(expression, character)
            }
        }
        t.setState(t)
    }

    export const onEqualSignClick: (t: t, _character: '=') => void = (t, _character) => {
        let expr = t.expression
        if (!Operand.isEmpty(t.operand)) {
            expr = Expression.addElement(t.expression, Operand.toNumber(t.operand))
        }
        t.operand = Operand.empty(t.operand)
        t.expression = Expression.evaluate(expr)
        t.setState(t)
    }

    export const onClearEntryClick: (t: t, _character: 'CE') => void = (t, _character) => {
        t.expression = Expression.empty(t.expression)
        t.operand = Operand.empty(t.operand)
        t.setState(t)
    }

    export const onClick: (t: t, character: any) => void = (t, character) => {
        const isOperator = Expression.Operator.all.find(op => op === character) !== undefined
        if (typeof (character) === 'number' || character === '.') {
            onDigitClick(t, character)
        } else if (isOperator) {
            onOperatorClick(t, character)
        } else if (character === '=') {
            onEqualSignClick(t, character)
        } else if (character === 'CE') {
            onClearEntryClick(t, character)
        } else {
            throw new Error(`Unhandled character: ${character}`)
        }
    }

    export const displayValue: (t: t) => string = (t) => {
        const expressionString = Expression.toString(t.expression)
        const operandString = Operand.toString(t.operand)
        const displayValue = [expressionString, operandString].filter(string => string !== '').join(" ")
        return Expression.isEmpty(t.expression) && Operand.isEmpty(t.operand) ? "0" : displayValue
    }
}

export default State