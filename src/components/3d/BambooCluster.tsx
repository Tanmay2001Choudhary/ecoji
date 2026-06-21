import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeBufferGeometries } from 'three-stdlib'

// Procedural Geometry Generator for Bamboo Stalks
const generateBambooGeometry = (height = 30, radius = 0.4, segments = 12, bendFactor = 2.0) => {
  const geometries: THREE.BufferGeometry[] = []
  const segmentHeight = height / segments
  
  for (let i = 0; i < segments; i++) {
    // Main internode segment (slightly tapered at the top)
    const cyl = new THREE.CylinderGeometry(radius * 0.95, radius, segmentHeight, 16)
    cyl.translate(0, i * segmentHeight + segmentHeight/2, 0)
    geometries.push(cyl)
    
    // Node joint (bulge)
    if (i > 0) {
      const node = new THREE.TorusGeometry(radius * 1.05, 0.06, 8, 16)
      node.rotateX(Math.PI / 2)
      node.translate(0, i * segmentHeight, 0)
      geometries.push(node)
    }
  }
  
  const merged = mergeBufferGeometries(geometries)
  if (!merged) return new THREE.BufferGeometry()
  
  // Apply organic curvature
  const positions = merged.attributes.position
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i)
    // Parabolic bend based on height
    const bend = Math.pow(y / height, 2) * bendFactor
    positions.setX(i, positions.getX(i) + bend)
  }
  
  merged.computeVertexNormals()
  return merged
}

export const BambooCluster = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  
  // Curated Color Palette
  const colors = useMemo(() => [
    new THREE.Color('#4CAF50'), // Primary
    new THREE.Color('#7CB342'), // Natural
    new THREE.Color('#2E7D32'), // Deep
    new THREE.Color('#81C784'), // Young
  ], [])

  // 1. Generate 3 unique geometry variations to avoid uniform repetition
  const geometries = useMemo(() => [
    generateBambooGeometry(35, 0.5, 14, 1.5),
    generateBambooGeometry(28, 0.35, 10, -2.0),
    generateBambooGeometry(32, 0.45, 12, 3.0),
  ], [])

  // 2. Define editorial composition (5-12 stalks, carefully placed)
  const instances = useMemo(() => {
    const data = [
      // Focal Foreground Cluster
      { x: -3, z: 2, scale: 1.2, geoIndex: 0, colorIdx: 0 },
      { x: -1, z: 0, scale: 0.9, geoIndex: 1, colorIdx: 1 },
      { x: -4, z: -2, scale: 1.1, geoIndex: 2, colorIdx: 2 },
      
      // Secondary Midground Cluster
      { x: 5, z: -5, scale: 1.0, geoIndex: 0, colorIdx: 1 },
      { x: 7, z: -4, scale: 0.85, geoIndex: 1, colorIdx: 3 },
      { x: 4, z: -8, scale: 1.1, geoIndex: 2, colorIdx: 0 },
      
      // Deep Background Depth
      { x: -8, z: -12, scale: 1.3, geoIndex: 0, colorIdx: 2 },
      { x: -12, z: -15, scale: 1.0, geoIndex: 1, colorIdx: 1 },
      { x: 10, z: -18, scale: 1.4, geoIndex: 2, colorIdx: 2 },
      { x: 2, z: -25, scale: 1.5, geoIndex: 0, colorIdx: 0 },
    ]
    return data.map(d => ({
      ...d,
      rotationY: Math.random() * Math.PI * 2,
      phaseOffset: Math.random() * Math.PI * 2
    }))
  }, [])

  // Apply positions and colors to InstancedMesh instances
  useMemo(() => {
    if (!meshRef.current) return
    // We will map instances into a single InstancedMesh by mapping all of them
    // Wait, an InstancedMesh takes ONE geometry. We must render multiple InstancedMeshes
    // if we have multiple geometries. We'll split them in the render loop.
  }, [])

  // Wind interaction
  useFrame(() => {
    // Wait, React cannot easily access multiple refs if we map them inside the component
    // We will handle swaying via group rotation or mapping inside the component
  })

  // To support multiple geometries efficiently, we render 3 InstancedMeshes
  return (
    <group>
      {geometries.map((geo, gIdx) => {
        // Filter instances that use this geometry
        const groupInstances = instances.filter(inst => inst.geoIndex === gIdx)
        if (groupInstances.length === 0) return null
        
        return (
          <BambooGroup 
            key={`bamboo-group-${gIdx}`} 
            geometry={geo} 
            instances={groupInstances} 
            colors={colors} 
          />
        )
      })}
    </group>
  )
}

// Sub-component to manage a single InstancedMesh per Geometry
const BambooGroup = ({ geometry, instances, colors }: { geometry: THREE.BufferGeometry, instances: any[], colors: THREE.Color[] }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  
  // Initialize Matrices and Colors
  useMemo(() => {
    // This runs before render to prepare data, but we apply it in useEffect or useLayoutEffect
    // Actually in R3F it's better to apply it via refs after mount
  }, [])

  // Apply initial positions and colors
  useFrame((state) => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    
    // Read high-frequency wind state from InteractionController
    const windX = state.scene.userData.windX || 0
    const windZ = state.scene.userData.windZ || 0
    
    instances.forEach((inst, i) => {
      // Wind Sway Calculation (combining base wind and pointer wind)
      const sway = Math.sin(state.clock.elapsedTime * 0.5 + inst.phaseOffset) * 0.02
      
      dummy.position.set(inst.x, -5, inst.z)
      dummy.rotation.set(sway - windZ, inst.rotationY, sway + windX)
      dummy.scale.setScalar(inst.scale)
      dummy.updateMatrix()
      
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      meshRef.current!.setColorAt(i, colors[inst.colorIdx])
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, instances.length]} castShadow receiveShadow>
      <meshStandardMaterial roughness={0.6} metalness={0.1} />
    </instancedMesh>
  )
}
