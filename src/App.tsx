import { FunctionComponent, useState } from 'react';
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@emotion/react';
import Expression, { Operand } from './Expression'

type KeyProps = { character: any, onClick: (character: any) => void, ariaLabel?: string }

const KeyPad: FunctionComponent<KeyProps> = ({ character, onClick, ariaLabel }) => {
  const className = `keypad-${character}`
  return (
    <Grid item xs={4}>
      <Button
        aria-label={ariaLabel ? ariaLabel : character}
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
  const textFieldValue = Expression.isEmpty(expression) && Operand.isEmpty(operand) ? "0" : displayValue

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
            value={textFieldValue}
            className="display"
            inputProps={{ "role": "math", "aria-label": textFieldValue }}
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
            <KeyPad character={'CE'} onClick={onClearEntryClick} ariaLabel={"Clear Entry"} />
          </Grid>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
