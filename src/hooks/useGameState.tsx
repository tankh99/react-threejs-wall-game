import React, { createContext, useContext, useState } from 'react'

// export const GameStateContext = createContext(false)

export default function useGameState() {
  const [lostGame, setLostGame] = useState(false)
  
}
