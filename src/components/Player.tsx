import { Triplet, useBox } from "@react-three/cannon";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";
import { BASE_PLAYER_SPEED } from "../constants/global";
import { GameStateContext } from "../experiments/WallGame";
import useGameState from "../hooks/useGameState";
import usePlayerControls from "../hooks/usePlayerControls";

export const PLAYER_SIZE: Triplet = [4, 4, 4];

export default function Player(props: any) {

  const {gameSpeed, onFall} = props;
  const {moveForward, moveBackward, moveLeft, moveRight} = usePlayerControls();
  const {lostGame, setLostGame} = useContext(GameStateContext)
  // const playerPos = useRef([0, 2, 0])
  const [playerSpeed, setPlayerSpeed] = useState(gameSpeed)
  const playerVelocity = useRef([0, 0, 0])

  useEffect(() => {
    setPlayerSpeed(gameSpeed * BASE_PLAYER_SPEED)
  }, [gameSpeed])
  
  const [ref, api] = useBox(() => ({
    type: "Dynamic",
    allowSleep: false,
    mass: 1,
    args: PLAYER_SIZE,
    position: props.playerPosition
    // velocity: [playerVelocity.current[0], playerVelocity.current[1], playerVelocity.current[2]],
  }), useRef<Mesh>(null), [lostGame])

  useEffect(() => {
    api.position.subscribe(v => {
      if (v[1] < -2) onFall()
    })
    api.velocity.subscribe(v => {
      playerVelocity.current = v;
    })
    
  }, [api.velocity])

  useFrame(() => {
    // const newVector = new Vector3(playerPos.current[0], playerPos.current[1], playerPos.current[2])
    if (lostGame) return

    const newVector = new Vector3(
      playerVelocity.current[0], 
      playerVelocity.current[1], 
      playerVelocity.current[2]
    )
    newVector.x = 0;
    newVector.z = 0;
    newVector.y = -10
    if (moveForward) {
      newVector.z = -playerSpeed
    }
    if (moveBackward) {
      newVector.z = playerSpeed
    }
    if (moveLeft) {
      newVector.x = -playerSpeed
    }
    if (moveRight) {
      newVector.x = playerSpeed
    }
    api.velocity.set(newVector.x, newVector.y, newVector.z)
  })
  
  return (
    <mesh
      name="player"
      ref={ref}
      {...props}>
        <boxGeometry args={PLAYER_SIZE}/>
        <meshBasicMaterial color="yellow"/>
    </mesh>
  )
}

