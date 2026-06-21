import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { use3DStore } from '@/store/use3DStore'

export const LeafParticleSystem = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const texture = useTexture('/src/assets/leaf.png')
  const count = 40

  const leaves = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        Math.random() * 20 - 5,
        (Math.random() - 0.5) * 20 - 5
      ),
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      scale: 0.5 + Math.random(),
      speed: 0.02 + Math.random() * 0.05,
      phase: Math.random() * Math.PI * 2
    }))
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    
    // Read from InteractionController via userData and Store
    const windX = state.scene.userData.windX || 0
    const windZ = state.scene.userData.windZ || 0
    const baseActivity = use3DStore.getState().leafActivity
    const activityMulti = state.scene.userData.leafActivityMultiplier || 1.0
    const activity = baseActivity * activityMulti

    leaves.forEach((leaf, i) => {
      // Wind pushing
      leaf.position.x += (Math.sin(state.clock.elapsedTime * leaf.speed + leaf.phase) * 0.02 + windX * 0.05) * activity
      leaf.position.y += Math.cos(state.clock.elapsedTime * leaf.speed * 2 + leaf.phase) * 0.01 * activity
      leaf.position.z += windZ * 0.05 * activity
      
      // Seamless boundaries (Wrap around)
      if (leaf.position.y < -5) leaf.position.y = 15
      if (leaf.position.x > 15) leaf.position.x = -15
      if (leaf.position.x < -15) leaf.position.x = 15
      if (leaf.position.z > 15) leaf.position.z = -15
      if (leaf.position.z < -15) leaf.position.z = 15

      // Rotation flutter
      leaf.rotation.x += 0.01 * activity + Math.abs(windX * 0.05)
      leaf.rotation.y += 0.02 * activity + Math.abs(windZ * 0.05)

      dummy.position.copy(leaf.position)
      dummy.rotation.copy(leaf.rotation)
      dummy.scale.setScalar(leaf.scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1.5, 1.5]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true} 
        blending={THREE.NormalBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}
