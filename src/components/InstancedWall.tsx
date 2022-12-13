import { Triplet, useCompoundBody } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import { Euler, Group, Vector3 } from "three";
import { SPEED_MODIFIER } from "../constants/global";
import { GameStateContext } from "../experiments/WallGame";
import useGameState from "../hooks/useGameState";


export enum WallType {
  LEFT,
  RIGHT,
  FRONT,
  BACK
}

/**
 * @param leeway: The number of units that's added to the gap of the wall.
 */
 interface WallProps {
  planeZLimit: number,
  planeXLimit: number,
  speed: number
  wallType: number,
  rotation: Euler,
  firstWallSize: Triplet | undefined,
  firstWallPosition: Vector3,
  secondWallSize: Triplet | undefined
  secondWallPosition: Vector3,
  onCollide: any,
  onRemoveWall: any,
}

export default function InstancedWall(props: WallProps) {
  const {planeXLimit, planeZLimit, wallType, speed, rotation, firstWallPosition, firstWallSize, 
    secondWallPosition, secondWallSize, onCollide, onRemoveWall} = props;
    // TODO: Figure out if this is still needed or not
  const wallVelocity = useRef([0, 0, 0])

  const [lifeEnded, setLifeEnded] = useState<boolean>(false)
  const {lostGame, setLostGame} = useContext(GameStateContext)

  const [wallRef, wallApi] = useCompoundBody(() => ({
    type: "Dynamic", // IMPORTANT, otherwise won't move
    onCollide: (e) => {
      onCollide(e)
    },
    shapes: [
      {
        type: "Box",
        args: firstWallSize,
        position: [firstWallPosition.x, firstWallPosition.y, firstWallPosition.z],
        rotation: [rotation.x, rotation.y, rotation.z],
      },
      {
        type: "Box",
        args: secondWallSize,
        position: [secondWallPosition.x, secondWallPosition.y, secondWallPosition.z],
        rotation: [rotation.x, rotation.y, rotation.z],
      }
    ]
  }), useRef<Group>(null), [props, lostGame, speed])

  useFrame(({clock}) => {
    if (lostGame || lifeEnded) return;
    // if (lifeEnded) {
    //   return onRemoveWall()
    // }
    const newVector = new Vector3(0, 0, 0)
    if (wallType === WallType.FRONT) newVector.z = speed;
    if (wallType === WallType.BACK) newVector.z = -speed
    if (wallType === WallType.LEFT) newVector.x = speed
    if (wallType === WallType.RIGHT) newVector.x = -speed;
    wallApi.velocity.set(newVector.x, newVector.y, newVector.z)
  })

  useEffect(() => {
    wallApi.position.subscribe(p => {
      let lifeEnded = false;
      switch (wallType) {
        case WallType.FRONT:
          if (p[2] >= planeZLimit) lifeEnded = true;
          break;
        case WallType.BACK:
          if (p[2] <= -planeZLimit) lifeEnded = true
          break;
        case WallType.LEFT:
          if (p[0] >= planeXLimit) lifeEnded = true
          break;
        case WallType.RIGHT:
          if (p[0] <= -planeXLimit) lifeEnded = true
          break;
        default:
          break;
      }
      setLifeEnded(prev => {
        if (prev == false && lifeEnded == true) {
          onRemoveWall()
        }
        return lifeEnded
      })
    })
  }, [props, lostGame])
  return (
    <group ref={wallRef}>
      <mesh castShadow rotation={rotation} position={firstWallPosition}>
        <boxGeometry  args={firstWallSize}/>
        <meshBasicMaterial color="red"/>
      </mesh>
      <mesh castShadow rotation={rotation} position={secondWallPosition}>
        <boxGeometry  args={secondWallSize} />
        <meshBasicMaterial color="red"/>
      </mesh>
      {/* <instancedMesh castShadow rotation={rotation} position={firstWallPosition}>
        <boxBufferGeometry attach={"geometry"} args={[20, 10, 1]}/>
        <meshBasicMaterial attach="material" 
          color="red"/>
      </instancedMesh>
      <instancedMesh castShadow rotation={rotation} position={secondWallPosition}>
        <boxBufferGeometry attach={"geometry"} args={secondWallSize} />
        <meshBasicMaterial attach="material" color="red"/>
      </instancedMesh> */}
    </group>
  )
}