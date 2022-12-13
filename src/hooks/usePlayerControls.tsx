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
      KeyW: 'moveForward',
      KeyS: 'moveBackward',
      KeyA: 'moveLeft',
      KeyD: 'moveRight'
  }
  return keys[key]
}