import { FunctionComponent } from 'react';
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@emotion/react';
import State from "./State"

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
  const state = State.useHooks()

  const theme = createTheme({ typography: { fontFamily: "'Rubik Mono One', sans-serif" } })

  const onClick: any = (character: any) => { State.onClick(state, character) }

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
            value={State.displayValue(state)}
            className="display"
            inputProps={{ "role": "math", "aria-label": State.displayValue(state) }}
            sx={{ width: "100%", background: "#fcf3d4" }}
            multiline
          />
          <Grid container>
            <KeyPad character={1} onClick={onClick} />
            <KeyPad character={2} onClick={onClick} />
            <KeyPad character={3} onClick={onClick} />
            <KeyPad character={4} onClick={onClick} />
            <KeyPad character={5} onClick={onClick} />
            <KeyPad character={6} onClick={onClick} />
            <KeyPad character={7} onClick={onClick} />
            <KeyPad character={8} onClick={onClick} />
            <KeyPad character={9} onClick={onClick} />
            <KeyPad character={0} onClick={onClick} />
            <KeyPad character={'.'} onClick={onClick} />
            <KeyPad character={'+'} onClick={onClick} />
            <KeyPad character={'-'} onClick={onClick} />
            <KeyPad character={'='} onClick={onClick} />
            <KeyPad character={'CE'} onClick={onClick} ariaLabel={"Clear Entry"} />
          </Grid>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
