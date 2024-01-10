import { useState, useEffect, useRef } from 'react'

const useCountdownTimer = (initialCountdown: number) => {
  const [countdown, setCountdown] = useState<number>(initialCountdown)
  const [isCounting, setIsCounting] = useState<Boolean | undefined>(false)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isCounting) {
      intervalRef.current = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 0) {
            clearInterval(intervalRef.current)
            setIsCounting(false)
            return initialCountdown
          } else {
            return prevCountdown - 1
          }
        })
      }, 1000)
    }
    return () => {
      intervalRef.current && clearInterval(intervalRef.current)
    }
  }, [isCounting,initialCountdown])

  const startCountdown = () => {
    setIsCounting(true)
  }

  const resetCountdown = () => {
    clearInterval(intervalRef.current)
    setIsCounting(false)
    setCountdown(initialCountdown)
  }

  return {
    countdown,
    isCounting,
    startCountdown,
    resetCountdown,
  }
}

export default useCountdownTimer
