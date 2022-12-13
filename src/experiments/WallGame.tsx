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
// import {GUI} from 'three/examples/jsm/libs/dat.gui.module'

export const GameStateContext = createContext({
  lostGame: false,
  setLostGame: () => {}
})

const DEFAULT_STARTING_POSITION: Triplet = [0, 2, 0]
const SCALING = 5;
const LEEWAY = 0

export default function CollisionTest() {
  const camera: any = useRef();

  const [score, setScore] = useState(0)
  const [lookAt, setLookAt] = useState<Triplet>([0, 0, 0])
  const [gameSpeed, setGameSpeed] = useState<number>(BASE_GAME_SPEED)
  const [leeway, setLeeway] = useState(LEEWAY)

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
    setLookAt([0, 120, 0])
    setGameSpeed(BASE_GAME_SPEED)
  }

  const onNextWall = () => {
    setScore(score => ++score)
    setGameSpeed(speed => speed + SCALING)
  }

  return (
    <>
    <ScoreText score={score}/>
    {lostGame && <GameOverText retry={restartGame}/>}
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

function ScoreText({score}: any) {
  return (
    <div className='absolute top-4 right-4 z-50 text-4xl select-none'>
      Score: {score}
    </div>
  )
}


function GameOverText({retry}: any) {

  return (
    <div className="absolute top-1/2 left-1/2 select-none z-50 flex flex-col items-center justify-center -translate-y-1/2 -translate-x-1/2">
    <div className='text-6xl mb-4'>
      You Lost
    </div>
    <button 
      onClick={retry}
      className='border border-2 py-2 px-4 border-black text-2xl hover:bg-black hover:text-white'>
      Try again?
    </button>
    </div>
  )
}


// function GameOverText({retry, position = [0, 20 ,0]}: any) {

//   const textRef: any = useRef()
//   const buttonRef: any = useRef();

//   useFrame(({camera}) => {
//     textRef.current.quaternion.copy(camera.quaternion)
//     buttonRef.current.quaternion.copy(camera.quaternion)
//   })
//   return (
//     <>
//     <Text ref={textRef} color="black" position={[0,150,0]} fontSize={10} 
//         anchorX="center" 
//         anchorY={"top-baseline"}>
//       You lost
//     </Text>
//     <Text ref={buttonRef} color="black" position={[0, 150, -5]} fontSize={5}
//       anchorX="center"
//       onClick={retry}
//       anchorY={"middle"}>
//       Try again?
//     </Text>
//     </>
//   )
// }
