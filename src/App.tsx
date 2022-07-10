import { FunctionComponent, useState } from 'react';
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@emotion/react';

namespace Operand {
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

  export const addDigit: (t: t, digit: Digit.t) => t = (t, digit) => {
    // 0 is first digit added to operand
    if (digit === 0 && t.length === 0) {
      // Do nothing
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

  export const isEmpty: (t: t) => boolean = (t) => { return t.length === 0 }
}

namespace Expression {
  export namespace Operator {
    export type t = '+' | '-'

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

type KeyProps = { character: any, onClick: (character: any) => void }

const KeyPad: FunctionComponent<KeyProps> = ({ character, onClick }) => {
  const className = `keypad-${character}`
  return (
    <Grid item xs={4}>
      <Button
        sx={{ width: "100%" }}
        className={className}
        variant='contained'
        onClick={() => {
          onClick(character)
        }}
      >
        {character}
      </Button>
    </Grid>
  )
}

function App() {
  const [operand, setOperand] = useState(Operand.create())
  const [expression, setExpression] = useState(Expression.create())

  function onDigitClick(character: Operand.Digit.t) {
    if (!Expression.containsOperator(expression)) {
      setExpression(Expression.empty(expression))
    }
    setOperand(Operand.addDigit(operand, character))
  }

  function onOperatorClick(character: (Expression.Operator.t | Operand.Sign.t)) {
    if (Operand.isEmpty(operand) && Expression.isEmpty(expression)) {
      // Operator entered first is interpreted as a "sign" of the operand
      setOperand(Operand.addDigit(operand, character))
    } else {
      let expr = expression
      if (!Operand.isEmpty(operand)) {
        expr = Expression.addElement(expression, Operand.toNumber(operand))
      }
      setOperand(Operand.empty(operand))
      setExpression(Expression.addElement(expr, character))
    }
  }

  function onEqualSignClick(_character: '=') {
    let expr = expression
    if (!Operand.isEmpty(operand)) {
      expr = Expression.addElement(expression, Operand.toNumber(operand))
    }
    setOperand(Operand.empty(operand))
    setExpression(Expression.evaluate(expr))
  }

  function onClearEntryClick(_character: 'CE') {
    setExpression(Expression.empty(expression))
    setOperand(Operand.empty(operand))
  }

  const expressionString = Expression.toString(expression)
  const operandString = Operand.toString(operand)
  const displayValue = [expressionString, operandString].filter(string => string !== '').join(" ")

  const theme = createTheme({ typography: { fontFamily: "'Rubik Mono One', sans-serif" } })

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ background: "#ccd4cd" }}
      >
        <Paper variant="elevation" className="calculator" sx={{ margin: "10px 0px", padding: "20px", background: "#2a2436" }}>
          <TextField
            variant="filled"
            value={Expression.isEmpty(expression) && Operand.isEmpty(operand) ? "0" : displayValue}
            className="display"
            sx={{ width: "100%", background: "#fcf3d4" }}
            multiline
          />
          <Grid container>
            <KeyPad character={1} onClick={onDigitClick} />
            <KeyPad character={2} onClick={onDigitClick} />
            <KeyPad character={3} onClick={onDigitClick} />
            <KeyPad character={4} onClick={onDigitClick} />
            <KeyPad character={5} onClick={onDigitClick} />
            <KeyPad character={6} onClick={onDigitClick} />
            <KeyPad character={7} onClick={onDigitClick} />
            <KeyPad character={8} onClick={onDigitClick} />
            <KeyPad character={9} onClick={onDigitClick} />
            <KeyPad character={0} onClick={onDigitClick} />
            <KeyPad character={'.'} onClick={onDigitClick} />
            <KeyPad character={'+'} onClick={onOperatorClick} />
            <KeyPad character={'-'} onClick={onOperatorClick} />
            <KeyPad character={'='} onClick={onEqualSignClick} />
            <KeyPad character={'CE'} onClick={onClearEntryClick} />
          </Grid>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
