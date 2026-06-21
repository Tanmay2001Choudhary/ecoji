import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const CameraController = () => {
  useFrame((state) => {
    // Since the 3D scene is restricted to the Hero section, 
    // we use a gentle continuous pan and mouse parallax instead of a full ScrollTrigger timeline.
    
    // Continuous floating movement
    const floatY = Math.sin(state.clock.elapsedTime * 0.5) * 0.5
    const floatX = Math.cos(state.clock.elapsedTime * 0.3) * 0.5
    
    // Base Target
    const targetX = floatX
    const targetY = 2 + floatY
    const targetZ = 16
    
    // Mouse Parallax Offset
    const finalX = targetX + state.pointer.x * 2.0
    const finalY = targetY + state.pointer.y * 1.5

    // Smoothly lerp camera position
    state.camera.position.lerp(new THREE.Vector3(finalX, finalY, targetZ), 0.05)
    
    // Smooth LookAt Vector Interpolation
    if (!state.camera.userData.lookAtVector) {
      state.camera.userData.lookAtVector = new THREE.Vector3(0, 5, -10)
    }
    
    const targetLookAt = new THREE.Vector3(state.pointer.x * 0.5, 5 + state.pointer.y * 0.5, -10)
    state.camera.userData.lookAtVector.lerp(targetLookAt, 0.05)
    
    state.camera.lookAt(state.camera.userData.lookAtVector)
  })

  return null
}
