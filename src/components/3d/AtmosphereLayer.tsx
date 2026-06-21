import { Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { use3DStore } from '@/store/use3DStore'

export const AtmosphereLayer = () => {
  const fogRef = useRef<THREE.FogExp2>(null)
  
  useFrame(() => {
    const density = use3DStore.getState().fogDensity
    if (fogRef.current) {
      fogRef.current.density = THREE.MathUtils.lerp(fogRef.current.density, density, 0.05)
    }
  })

  return (
    <>
      {/* Layered Fog matching background color for infinite depth illusion */}
      <fogExp2 ref={fogRef} attach="fog" color="#F8F5EE" density={0.04} />
      
      {/* Floating Pollen / Dust catching the sunlight */}
      <Sparkles 
        count={200} 
        scale={25} 
        size={3} 
        speed={0.2} 
        opacity={0.4} 
        color="#F6E7B0" 
        position={[0, 5, 0]} 
        noise={1}
      />
      
      {/* Ambient background particles */}
      <Sparkles 
        count={100} 
        scale={35} 
        size={5} 
        speed={0.1} 
        opacity={0.15} 
        color="#FFF8E7" 
        position={[0, 8, -5]} 
      />
    </>
  )
}
