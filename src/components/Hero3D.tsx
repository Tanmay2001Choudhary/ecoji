import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { SceneManager } from './3d/SceneManager'

export const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto overflow-hidden hidden md:block" data-cursor="interact">
      {/* 
        The Canvas manages the WebGL context.
        All storytelling, geometry, performance, and interaction logic
        has been strictly modularized inside SceneManager to keep this root clean.
      */}
      <Canvas camera={{ position: [0, 2, 18], fov: 45 }}>
        <Suspense fallback={null}>
          <SceneManager />
        </Suspense>
      </Canvas>
    </div>
  )
}
