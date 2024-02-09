import React, { useEffect, useState } from 'react'

export default function usePlayerControls() {
  const [movement, setMovement] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false
  })

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      console.log(e.code);
      if (actionByKey(e.code)) {
        setMovement((prevState) => ({
          ...prevState,
          [actionByKey(e.code)]: true
        }))
      }
    }

    const handleKeyUp = (e: any) => {
      if (actionByKey(e.code)) {
        setMovement((prevState) => ({
          ...prevState,
          [actionByKey(e.code)]: false
        }))
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
  
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [])
  
  return movement
  
}

function actionByKey(key: string) {
  const keys: any = {
      // KeyW: 'moveForward',
      ArrowUp: 'moveForward',
      // KeyS: 'moveBackward',
      ArrowDown: 'moveBackward',
      // KeyA: 'moveLeft',
      ArrowLeft: 'moveLeft',
      // KeyD: 'moveRight',
      ArrowRight: 'moveRight'
  }
  return keys[key]
}