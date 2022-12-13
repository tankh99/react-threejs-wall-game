import { CollideEvent, Triplet, useCompoundBody } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Euler, Group, Vector3 } from 'three';
import { PLAYER_SIZE } from '../components/Player';
import * as THREE from 'three'
import InstancedWall, { WallType } from '../components/InstancedWall';
import { BASE_WALL_SPEED, SPEED_MODIFIER } from '../constants/global';
import { GameStateContext } from './WallGame';


/**
 * @param planeZ: Is actually planeY since the plane is rotated, but we call it planeZ for 
 * convenience's sake
 * @param running: Determins whether walls should continue to be instanced
 */
interface P {
  leeway: number,
  onNextWall: any,
  planeX: number,
  planeZ: number,
  onCollideWall: any
  gameSpeed: any

}


interface WallOrientation {
  wallType: WallType,
  rotation: Euler | undefined,
  firstWallSize: Triplet | undefined,
  firstWallPosition: Vector3 | undefined,
  secondWallSize: Triplet | undefined
  secondWallPosition: Vector3 | undefined,
  speed: number,
}

export default function WallInstancer({leeway, onNextWall, gameSpeed, planeX, planeZ, onCollideWall}: P) {

  const HEIGHT = 10;

  // const [wallSpeed, setWallSpeed] = useState<number>(gameSpeed)
  const {lostGame, setLostGame} = useContext(GameStateContext)
  
  const [wallArgs, setWallArgs] = useState<WallOrientation>()

  // const [firstWallPosition, setFirstWallPos] = useState<Vector3>()
  // const [secondWallPosition, setSecondWallPos] = useState<Vector3>()
  // const [firstWallSize, setFirstWallSize] = useState<Triplet>()
  // const [secondWallSize, setSecondWallSize] = useState<Triplet>()
  // const [rotation, setRotation] = useState<Euler>()
  // // TODO: Initialise this somewhere
  
  useEffect(() => {
    updateWallArgs()
  }, [lostGame, gameSpeed])

  /**
   * Produces the point at which the gap starts.
   * For WallType.Front and WallType.Back, it affects the Z-axis
   * For WallType.LEFT and WallType.RIGHT, it affects the X-axis
   * @param wallType 
   * @returns 
   */
   const determineGapSize = (wallType: WallType) => {
    let MIN, MAX;
    if (wallType === WallType.FRONT || wallType === WallType.BACK) {
      MIN = PLAYER_SIZE[2]; // Use Z-value when horizontal wall.
      MAX = planeZ / 2 - PLAYER_SIZE[2];
    } else if (wallType === WallType.LEFT || wallType === WallType.RIGHT) {
      MIN = PLAYER_SIZE[0]; // Use X-value when horizontal wall
      MAX = planeX / 2 - PLAYER_SIZE[0];
      
    } else {
      console.error("Invalid WallType", wallType)
      return -1;
    }
    // TODO: Allow the randomPoint / gap to be 0
    const randomPoint = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    return randomPoint
  }

  /**
   * 
   * @param openingPoint - The unit at which the gap starts to form
   * @param wallType 
   * @returns 
   */
  const determineWallArgs = (openingPoint: number, wallType: WallType) => {
    let rotation, firstWallSize: Triplet, firstWallPosition, 
      secondWallSize: Triplet, secondWallPosition, gapSize;
      

    // FIXME: Fill up the rest of the wall types
    gapSize = PLAYER_SIZE[0] * 1.25 + leeway;
    rotation = new Euler(0, 0, 0)
    
    // secondWallPosition = new Vector3(100, HEIGHT / 2, 0)
    if (wallType === WallType.FRONT) {
      firstWallSize = [openingPoint, HEIGHT, 1];
      secondWallSize = [planeX - openingPoint - gapSize, HEIGHT, 1]
      
      firstWallPosition = new Vector3(-(planeX / 2 - (firstWallSize[0]) / 2) , HEIGHT / 2, -planeZ / 2)
      secondWallPosition = new Vector3((planeX / 2 - (secondWallSize[0]) / 2), HEIGHT / 2, -planeZ/ 2)
      } else if (wallType === WallType.BACK) {
    
      firstWallSize = [openingPoint, HEIGHT, 1];
      secondWallSize = [planeX - openingPoint - gapSize, HEIGHT, 1]
      
      firstWallPosition = new Vector3(-(planeX / 2 - (firstWallSize[0]) / 2) , HEIGHT / 2, planeZ / 2)
      secondWallPosition = new Vector3((planeX / 2 - (secondWallSize[0]) / 2), HEIGHT / 2, planeZ/ 2)

    } else if (wallType === WallType.LEFT) {
      
      firstWallSize = [1, HEIGHT, openingPoint];
      secondWallSize = [1, HEIGHT, planeZ - openingPoint - gapSize]
      
      firstWallPosition = new Vector3(-planeX / 2, HEIGHT / 2, -(planeZ / 2 - (firstWallSize[2]) / 2))
      secondWallPosition = new Vector3(-planeX / 2, HEIGHT / 2, (planeZ / 2 - (secondWallSize[2]) / 2))

    } else if (wallType === WallType.RIGHT) {

      firstWallSize = [1, HEIGHT, openingPoint];
      secondWallSize = [1, HEIGHT, planeZ - openingPoint - gapSize]
      
      firstWallPosition = new Vector3(planeX / 2, HEIGHT / 2, -(planeZ / 2 - (firstWallSize[2]) / 2))
      secondWallPosition = new Vector3(planeX / 2, HEIGHT / 2, (planeZ / 2 - (secondWallSize[2]) / 2))

    } else {
      console.error("Unknown wall Type!")
      return null;
    }
    const newWallArgs: WallOrientation = {
      wallType,
      rotation,
      firstWallSize,
      firstWallPosition,
      secondWallSize,
      secondWallPosition,
      speed: gameSpeed * BASE_WALL_SPEED
    }
    return newWallArgs
  }

  const updateWallArgs = () => {
    const randomWallType = Math.floor(Math.random() * Object.values(WallType).length / 2)
    const newWall = determineWallArgs(determineGapSize(randomWallType), randomWallType)!
    setWallArgs(newWall)
  }

  const instancerOnCollideWall = (e: CollideEvent) => {
    const contactedMesh = e.contact.bi
    if (contactedMesh.name == "player") {
      setWallArgs(undefined)
      onCollideWall(e)
    }
  }

  const instancerOnNextWall = () => {
    updateWallArgs()
    onNextWall()
  }

  /**
   * @param wallType check for null because wallType can = 0, and that will lead to default false case
   */
  
  if (!wallArgs) return <></>
  const {speed, wallType, rotation, firstWallPosition, firstWallSize, secondWallPosition, secondWallSize} = wallArgs;
  return (
    <InstancedWall
    // TODO: REMOVE WALL TYPE
      wallType={wallType}
      firstWallPosition={firstWallPosition!}
      firstWallSize={firstWallSize}
      secondWallPosition={secondWallPosition!}
      secondWallSize={secondWallSize}
      rotation={rotation!}
      planeXLimit={planeX}
      planeZLimit={planeZ}
      onCollide={instancerOnCollideWall}
      onRemoveWall={instancerOnNextWall}
      speed={speed}/>
  )  
}

