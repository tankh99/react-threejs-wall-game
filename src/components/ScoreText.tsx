
export default function ScoreText({score}: any) {
  return (
    <div className='absolute top-4 right-4 z-50 text-4xl text-black select-none'>
      Score: {score}
    </div>
  )
}