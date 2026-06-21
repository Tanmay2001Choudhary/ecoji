import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { use3DStore } from '@/store/use3DStore'
import * as THREE from 'three'
import { Environment } from '@react-three/drei'

export const EnvironmentLayer = () => {
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const sunRef = useRef<THREE.DirectionalLight>(null)
  
  useFrame(() => {
    const brightness = use3DStore.getState().sceneBrightness
    
    // Smoothly interpolate light intensity for seamless storytelling transitions
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, 0.8 * brightness, 0.05)
    }
    if (sunRef.current) {
      sunRef.current.intensity = THREE.MathUtils.lerp(sunRef.current.intensity, 2.2 * brightness, 0.05)
    }
  })

  return (
    <>
      <color attach="background" args={['#F8F5EE']} />
      
      {/* Soft Ivory Ambient Light */}
      <ambientLight ref={ambientRef} color="#FFF8E7" intensity={0.8} />
      
      {/* Warm Sunlight */}
      <directionalLight 
        ref={sunRef}
        position={[20, 30, -5]} 
        color="#F6E7B0" 
        intensity={2.2}
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />
      
      {/* Cool Fill Light for shadow depth */}
      <directionalLight position={[-15, 10, 15]} intensity={0.6} color="#81C784" />
      
      {/* HDR Environment Reflections */}
      <Environment preset="forest" background={false} />
    </>
  )
}
