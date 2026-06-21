import { PerformanceMonitor } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

export const PerformanceController = () => {
  const setDpr = useThree((state) => state.setDpr)
  
  return (
    <PerformanceMonitor 
      onIncline={() => setDpr(2)} 
      onDecline={() => setDpr(1)} 
      flipflops={3} 
      onFallback={() => setDpr(0.75)} // Aggressive fallback for older mobile devices
    />
  )
}
