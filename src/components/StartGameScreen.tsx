import useAudio from "../hooks/useAudio"
import bgm from '../assets/bgm.mp3'

export default function StartGameScreen({startGame}: any) {  

  return (
    <div className="absolute top-1/2 left-1/2 select-none z-50 flex flex-col items-center justify-center -translate-y-1/2 -translate-x-1/2">
      <div className='text-6xl mb-4'>
        Wall Game
      </div>
      <p className="text-lg mb-4">Welcome. Use the arrow keys to move the red cube (you). Get as high of a score as possible</p>

      <button 
        // onClick={retry}
        onClick={startGame}
        className='border border-2 py-2 px-4 border-black text-2xl hover:bg-black hover:text-white'>
        Start Game
      </button>
    </div>
  )
}
