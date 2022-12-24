import ScoreText from "./ScoreText";

export default function GameOverScreen({retry}: any) {  

  
  return (
    <>
      {/* <ScoreText score={score}/> */}
      <div className="absolute top-1/2 left-1/2 select-none z-40 w-screen h-screen bg-white flex flex-col items-center justify-center -translate-y-1/2 -translate-x-1/2">
      <div className='text-6xl mb-4'>
        You Lost
      </div>
      <button 
        onClick={retry}
        // onClick={test}
        className='border border-2 py-2 px-4 border-black text-2xl hover:bg-black hover:text-white'>
        Try again?
      </button>
      </div>
    </>
  )
}
