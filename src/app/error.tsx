'use client'
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void;
}) {
  useEffect(() => {
    console.error('CRASH ERROR:', error)
  }, [error])
 
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-bold mb-4 font-heading text-red-500">StartupSafari Encountered an Exception</h2>
      <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10 max-w-2xl w-full mb-8 overflow-auto">
        <p className="text-sm font-mono text-zinc-400 text-left whitespace-pre-wrap">
          {error.message || 'Unknown Error'}
          {error.stack && `\n\nStack Trace:\n${error.stack}`}
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-all"
      >
        Try again
      </button>
    </div>
  )
}
