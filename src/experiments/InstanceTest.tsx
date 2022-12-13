import { CollideBeginEvent, CollideEvent, useBox, useCompoundBody } from '@react-three/cannon';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import React, { useRef, useState } from 'react'
import { Group, InstancedMesh } from 'three';
import Ground from '../components/Ground'

export default function InstanceTest() {
  const camera: any = useRef();

  const newBox = (index: number) => {
    setBoxes((prevState) => {
      return prevState.concat(<InstancedBox index={index} 
          removeBox={removeBox}
          newBox={newBox}/>)
    })

  }

  const removeBox = (index: number) => {
    setBoxes((prevState) => {
      // const result = [...prevState.slice(0, index), ...prevState.slice(index + 1)]
      const result = prevState.filter((_, i) => i !== index)
      return result
    })
  }

  const [boxes, setBoxes] = useState<any[]>([
    <InstancedBox index={0} 
      removeBox={removeBox}
      newBox={newBox}/>
    ])


  return (
    <>
      <OrbitControls target={[0, 0, 0]} />
      <color attach="background" args={['#f6d186']} />
      <PerspectiveCamera 
        ref={camera}
        // position={[0, 30, 60]}
        position={[0, 30, 25]}
        makeDefault />
      
      {/* {boxes.map((box) => {
        return box
      })} */}
      <InstancedGroup/>
      <Ground/>
    </>
  )
}
function InstancedGroup() {
  
  const [ref, api] = useCompoundBody(() => ({
    mass: 1,
    type: "Dynamic", // IMPORTANT, otherwise won't move
    shapes: [
      {
        type: "Box",
        args: [2, 2, 2],
        position: [0, 4, 0],
      },
      {
        type: "Box",
        args: [4, 2, 4],
        position: [0, 2, 0],
      }
    ]
  }), useRef<Group>(null))
  return (
    <group ref={ref}>
      <mesh castShadow position={[0, 4, 0]}>
        <boxBufferGeometry args={[2,2,2]} />
        <meshBasicMaterial color="red"  />
      </mesh>
      <mesh castShadow position={[0, 2, 0]}>
        <boxBufferGeometry args={[4, 2, 4]}/>
        <meshNormalMaterial />
      </mesh>
    </group>
  )
}

function InstancedBox({index, newBox, removeBox}: any) {
  // const [instancedBox, api] = useBox((index) => {
  //     return {
  //         args: [1, 1, 1],
  //         mass: 1,
  //         position: [Math.random() - 0.5, index * 2, Math.random() - 0.5]
  //     }
  // }, useRef<InstancedMesh>(null))
  const [number, setNumber] = useState(1)
  const [collided, setCollided] = useState(false)
  const BASE_HEIGHT = 5
  const [ref, api] = useBox(() => ({
    mass: 1,
    args: [1, 1, 1],
    position: [Math.random() - 0.5, (index + 1) * BASE_HEIGHT, Math.random() - 0.5],
    onCollideBegin: (e: CollideBeginEvent) => {
      removeBox(index)
      newBox(index + 1)
    }
  }), useRef<InstancedMesh>(null))

  useFrame(() => {
    // api.at(Math.floor(Math.random() * number))
    // .position.set(0, BASE_HEIGHT, 0)
  })


  return (
    <instancedMesh ref={ref} args={[undefined, undefined, number]}>
      <boxGeometry args={[1,1,1]}/>
      <meshBasicMaterial color="blue"/>
    </instancedMesh>
  )
}