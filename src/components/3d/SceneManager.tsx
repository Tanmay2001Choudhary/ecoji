import { EnvironmentLayer } from './EnvironmentLayer'
import { BambooCluster } from './BambooCluster'
import { LeafParticleSystem } from './LeafParticleSystem'
import { AtmosphereLayer } from './AtmosphereLayer'
import { CameraController } from './CameraController'
import { InteractionController } from './InteractionController'
import { PerformanceController } from './PerformanceController'

export const SceneManager = () => {
  return (
    <group>
      {/* Controllers */}
      <PerformanceController />
      <CameraController />
      <InteractionController />
      
      {/* Environment & Lighting */}
      <EnvironmentLayer />
      <AtmosphereLayer />
      
      {/* Living Flora (Designed for future GLB Product insertion here) */}
      <BambooCluster />
      <LeafParticleSystem />
    </group>
  )
}
