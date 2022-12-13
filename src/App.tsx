import React, { ChangeEvent, Suspense, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import CollisionTest from './experiments/WallGame';
import { Debug, Physics } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';

export default function App() {
  return (
      <div className='h-screen w-screen'>
        <CollisionTest/>

      </div>
  );
}
