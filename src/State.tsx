import { Dispatch, SetStateAction, useState } from 'react'
import Expression, { Operand } from './Expression'

namespace State {
    export type t = {
        operand: Operand.t,
        expression: Expression.t,
        setOperand: Dispatch<SetStateAction<Operand.t>>,
        setExpression: Dispatch<SetStateAction<Expression.t>>
    }

    export const useHooks: () => t = () => {
        const [operand, setOperand] = useState(Operand.create())
        const [expression, setExpression] = useState(Expression.create())
        return { operand, expression, setOperand, setExpression }
    }

    export const onDigitClick: (t: t, character: Operand.Digit.t) => void = (t, character) => {
        if (!Expression.containsOperator(t.expression)) {
            t.setExpression(Expression.empty(t.expression))
        }
        t.setOperand(Operand.addDigit(t.operand, character))
    }

    export const onOperatorClick: (t: t, character: (Expression.Operator.t | Operand.Sign.t)) => void = (t, character) => {
        if (Operand.isEmpty(t.operand) && Expression.isEmpty(t.expression)) {
            // Operator entered first is interpreted as a "sign" of the operand
            t.setOperand(Operand.addDigit(t.operand, character))
        } else {
            let expr = t.expression
            if (!Operand.isEmpty(t.operand)) {
                expr = Expression.addElement(t.expression, Operand.toNumber(t.operand))
            }
            t.setOperand(Operand.empty(t.operand))
            t.setExpression(Expression.addElement(expr, character))
        }
    }

    export const onEqualSignClick: (t: t, _character: '=') => void = (t, _character) => {
        let expr = t.expression
        if (!Operand.isEmpty(t.operand)) {
            expr = Expression.addElement(t.expression, Operand.toNumber(t.operand))
        }
        t.setOperand(Operand.empty(t.operand))
        t.setExpression(Expression.evaluate(expr))
    }

    export const onClearEntryClick: (t: t, _character: 'CE') => void = (t, _character) => {
        t.setExpression(Expression.empty(t.expression))
        t.setOperand(Operand.empty(t.operand))
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