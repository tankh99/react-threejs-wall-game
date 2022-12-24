import { CollideEvent, Debug, Physics, Triplet, useBox, usePlane } from '@react-three/cannon'
import { Box, OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { createContext, Ref, useEffect, useMemo, useRef, useState } from 'react'
import { useControl } from 'react-three-gui'
import { AxesHelper, Euler, Mesh, Vector3 } from 'three'
import Plane from '../components/Ground'
import Player from '../components/Player'
import { BASE_GAME_SPEED } from '../constants/global'
import useGameState from '../hooks/useGameState'
import WallInstancer from './WallInstancer'
import useAudio from '../hooks/useAudio'
import scoreUp from '../assets/score-up.wav'
import GameOverScreen from '../components/GameOverScreen'
import ScoreText from '../components/ScoreText'
import StartGameScreen from '../components/StartGameScreen'
import bgm from '../assets/bgm.mp3'

export const GameStateContext = createContext({
  lostGame: false,
  setLostGame: () => {}
})

const DEFAULT_STARTING_POSITION: Triplet = [0, 2, 0]
const SCALING = 5;
const LEEWAY = 5

export default function CollisionTest() {
  const camera: any = useRef();
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [lookAt, setLookAt] = useState<Triplet>([0, 0, 0])
  const [gameSpeed, setGameSpeed] = useState<number>(BASE_GAME_SPEED)
  const [leeway, setLeeway] = useState(LEEWAY)

  const [toggle, playBgm, pauseBgm] = useAudio(bgm)
  
  useEffect(() => {
    if (camera.current) {
      camera.current.lookAt(lookAt)
    }
  }, [lookAt])
  const [lostGame, setLostGame]: any = useState(false)

  const value = useMemo(() => ({
    lostGame,
    setLostGame
  }), [lostGame])

  const [playerPosition, setPlayerPosition] = useState<Triplet>(DEFAULT_STARTING_POSITION)
  
  const onCollideWall = (e: CollideEvent) => {
    const contactedMesh = e.contact.bi
    if (contactedMesh.name == "player") {
      loseGame()
    }
  }

  const restartGame = () => {
    setLostGame(false)
    playBgm()
    setPlayerPosition(DEFAULT_STARTING_POSITION)
    setLookAt([0,0,0])
    setScore(0)
  }

  /**
   * Lose Game
   * 1. Set game state to lost
   * 2. Look at the gameover text
   * 3. Reset game speed
   */
  const loseGame = () => {
    setLostGame(true)
    pauseBgm()
    setLookAt([0, 0, 0])
    setGameSpeed(BASE_GAME_SPEED)
  }

  const onNextWall = () => {
    setScore(score => ++score)
    setGameSpeed(speed => speed + SCALING)
  }

  if (!started) {
    const startGame = () => {
      playBgm()
      setStarted(true)
    }
    return <StartGameScreen startGame={startGame} />
  }

  return (
    <>

    {lostGame ? (
      <>
      <ScoreText score={score}/>
      <GameOverScreen retry={restartGame}/>
      </>
    ) : <ScoreText score={score}/>}
    <Canvas>
      <Physics frictionGravity={[0, 0, 0]} >
        {/* <Debug color="black" scale={1.1}> */}
          <GameStateContext.Provider value={value}>
            <pointLight position={[1,2,2]} />
            <rectAreaLight width={3}
              height={3}
              color={"white"}
              intensity={1}
              position={[2,1,4]}
              castShadow/>
            <OrbitControls target={lookAt} />
            <color attach="background" args={['#f6d186']} />
            <PerspectiveCamera 
              ref={camera} 
              position={[0, 80, 0]}
              makeDefault />
              {/* {lostGame && <GameOverText retry={restartGame} />} */}
                <Plane/>
                <Player gameSpeed={gameSpeed} playerPosition={playerPosition} onFall={loseGame} />
                <WallInstancer gameSpeed={gameSpeed}
                  leeway={leeway}
                  onNextWall={onNextWall}
                  onCollideWall={onCollideWall} 
                  planeX={50} 
                  planeZ={50}/>
              {/* </Canvas> */}
          </GameStateContext.Provider>
        {/* </Debug> */}
      </Physics>
    </Canvas>
    </>
  )
}



