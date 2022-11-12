import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Grid,
  theme,
  Tag,
  Button,
  GridItem,
  HStack,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { useState } from "react"


export const App = () => {
  const [grid, setGrind] = useState(defaultGrid())
  const [player, setPlayer] = useState({player1: 0, player2: 0, turn: "Player 1"})
  const [gridIndex, setGridIndex] = useState(3);

  function defaultGrid(): number[][] {
    return [[0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],]
  }

  function chkLine(a: number,b: number,c: number,d: number): boolean {
    // Check first cell non-zero and all cells match
    return ((a !== 0) && (a === b) && (a === c) && (a === d));
  }

  function checkConnectFour(): boolean {
    // Check down
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 7; c++) {
          if (chkLine(grid[r][c], grid[r+1][c], grid[r+2][c], grid[r+3][c]))
              return true
      }
    }
    // Check right
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
            if (chkLine(grid[r][c], grid[r][c+1], grid[r][c+2], grid[r][c+3]))
                return true
      }
    }

    // Check down-right
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 5; c++) {
            if (chkLine(grid[r][c], grid[r+1][c+1], grid[r+2][c+2], grid[r+3][c+3]))
                return true
        }
    }
    // Check down-left
    for (let r = 3; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
            if (chkLine(grid[r][c], grid[r-1][c+1], grid[r-2][c+2], grid[r-3][c+3]))
                return true
        }
    }
    return false;
  }

  function gridColor(item: number): string {
    // Player 1 is 1 Player 2 is 2
    switch(item) {
      case 1:
        return "green.600"
      case 2:
        return "red.600"
      default:
        return "gray"
    }
  }

  function editGridIndex(add: boolean): void {
    if (add) {
      if(gridIndex + 1 === 7) {
        return setGridIndex(0);
      } 
      return setGridIndex(gridIndex + 1);
    }
    else if (gridIndex -1 === -1) {
      return setGridIndex(6);
    }
    return setGridIndex(gridIndex - 1)
  }

  function validSpot(): boolean {
    // Have to return the opposite as we dont want it to be disabled when its free!
    return !(grid[0][gridIndex] === 0)
  }
  
  function submitTurn(): void {
    
    // Insert chip in selected column.
    let lastValidRow = 0;
    for (let i = 0; i < 6; i++) {
      console.log(typeof grid[i][gridIndex])
      if(grid[i][gridIndex] !== 0) break;
      lastValidRow = i
    }

    setGrind(currGrid => {
      currGrid[lastValidRow][gridIndex] = (player.turn === "Player 1" ? 1 : 2)
      return currGrid
    })

    // Reset player position to middle 
    //setGridIndex(3)
    
    // Check for connect 4
    const win = checkConnectFour()
    if(win) {
      // Add player's win to scoreboard
      setPlayer(currentPlayer => {
        if(currentPlayer.turn === "Player 1") {
          return {player1: currentPlayer.player1 + 1, player2: currentPlayer.player2, turn: currentPlayer.turn}
        }
        return {player1: currentPlayer.player1, player2: currentPlayer.player2 + 1, turn: currentPlayer.turn}
      })

      // Finally reset the grid
      setGrind(defaultGrid())
    }

    setPlayer(currentPlayer => {return {player1: currentPlayer.player1, player2: currentPlayer.player2,  turn: (currentPlayer.turn === "Player 1" ? "Player 2" : "Player 1")}});
    // Ensure there are free spots on the grid
    if(!grid[0].some(val => val === 0)) {
      alert("No one won as there's no valid spots left!")
      setGrind(defaultGrid())
    } 
  }

  return (
  <ChakraProvider theme={theme}>
    <Box fontSize="xl">
      <Grid minH="1vh" p={2}>

        <ColorModeSwitcher justifySelf="flex-end" />
        <Text justifySelf="center"> Connect 4</Text>
        <Text justifySelf="center">Current Player: {player.turn}</Text>

        <HStack>
          <Button paddingRight="20vh" marginRight="75%" onClick={(e) => editGridIndex(false)}>Left</Button>
          <Button paddingLeft="20vh" onClick={(e) => editGridIndex(true)}>Right</Button>
        </HStack>

        <Grid templateColumns='repeat(7, 1fr)' gap={1} id="gameboard" paddingLeft="25vh" paddingRight="25vh" key="gameboard">
          {grid.map((row) => row.map((item, index) => {
            if(index !== gridIndex || item !== 0) return <GridItem colSpan={1} h='10' bg={gridColor(item)} ></GridItem> 
            return <GridItem colSpan={1} h='10' bg='yellow' ></GridItem> 
              }
            ))
          }
        </Grid>

        <VStack spacing={2}>
          <Tag size="lg" variant='solid' colorScheme='teal'>
            Score
          </Tag>

          <HStack>
            <Tag size="lg" variant='solid' colorScheme='green'>
              Player 1: {player.player1}
            </Tag>
            <Tag size="lg" variant='solid' colorScheme='red'>
              Player 2: {player.player2}
            </Tag>
          </HStack>

          <Button onClick={e => submitTurn()} disabled={validSpot()}>Submit Turn</Button>
        </VStack>

      </Grid>
    </Box>
  </ChakraProvider>
)}
