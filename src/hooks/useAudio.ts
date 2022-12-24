import React, { useEffect, useState } from 'react'

export default function useAudio(url: any) {
  
  const [audio] = useState(new Audio(url))
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    playing ? audio.play() : audio.pause()
    setPlaying(!playing)
  }

  // useEffect(() => {
  //   playing ? audio.play() : audio.pause()
  //   console.log(playing)
  // }, [playing])
  
  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false))
  
    return () => {
      audio.addEventListener("ended", () => setPlaying(true))
    }
  }, [])

  const play = () => {
    audio.play()
  }

  const pause = () => {
    audio.pause()
  }
  
  return [toggle, play, pause] as const
}
