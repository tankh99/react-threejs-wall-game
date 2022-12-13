import { useBox, usePlane } from '@react-three/cannon'
import React, { useRef } from 'react'
import { Mesh } from 'three'


export const PLANE_X = 50;
export const PLANE_Y = 50;

export default function Ground() {

  // const [planeRef] = usePlane(() => ({
  //   mass: 0,
  //   position: [0, 0, 0],
  //   rotation: [-0.5 * Math.PI, 0, 0],
  //   args: [PLANE_X, PLANE_Y, 1],
  // }), useRef<Mesh>(null))

  const [groundRef] = useBox(() => ({
    position: [0, 0, 0],
    rotation: [-0.5 * Math.PI, 0, 0],
    args: [PLANE_X, PLANE_Y, 1],
  }), useRef<Mesh>(null))

  return (
    <mesh name="ground" ref={groundRef} receiveShadow>
      <planeGeometry args={[PLANE_X, PLANE_Y]} />
      <meshBasicMaterial color="gray" />
    </mesh>
  )
}
