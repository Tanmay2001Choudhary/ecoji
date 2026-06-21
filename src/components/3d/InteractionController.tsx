import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef } from 'react'

export const InteractionController = () => {
  const currentWind = useRef({ x: 0, z: 0 })
  
  useFrame((state) => {
    // Lerp wind vectors towards pointer for smooth, elastic wind fields
    currentWind.current.x = THREE.MathUtils.lerp(currentWind.current.x, state.pointer.x * 0.6, 0.05)
    currentWind.current.z = THREE.MathUtils.lerp(currentWind.current.z, state.pointer.y * 0.6, 0.05)
    
    // Inject ultra-fast globals into scene userData so InstancedMeshes can read them 
    // without triggering React state updates across the app
    state.scene.userData.windX = currentWind.current.x
    state.scene.userData.windZ = currentWind.current.z
    
    // Dynamically increase leaf activity when user moves mouse aggressively
    const mouseVelocity = Math.abs(state.pointer.x) + Math.abs(state.pointer.y)
    
    // Store it in userData as well for non-reactive high-frequency reads
    state.scene.userData.leafActivityMultiplier = 1.0 + (mouseVelocity * 2.0)
  })
  
  return null
}
