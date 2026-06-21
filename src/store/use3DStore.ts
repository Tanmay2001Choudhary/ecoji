import { create } from 'zustand'

interface ThreeDState {
  // GSAP Camera Target Proxies
  cameraTarget: { x: number; y: number; z: number }
  cameraLookAt: { x: number; y: number; z: number }
  
  // Scene Global State
  windStrength: number
  leafActivity: number
  fogDensity: number
  sceneBrightness: number
  
  // Actions
  setCameraTarget: (target: Partial<ThreeDState['cameraTarget']>) => void
  setCameraLookAt: (target: Partial<ThreeDState['cameraLookAt']>) => void
  setSceneState: (state: Partial<Omit<ThreeDState, 'cameraTarget' | 'cameraLookAt' | 'setCameraTarget' | 'setCameraLookAt' | 'setSceneState'>>) => void
}

export const use3DStore = create<ThreeDState>((set) => ({
  // Default values for the Hero section
  cameraTarget: { x: 0, y: 2, z: 18 },
  cameraLookAt: { x: 0, y: 5, z: -10 },
  
  windStrength: 0.2,
  leafActivity: 0.1,
  fogDensity: 0.04,
  sceneBrightness: 1.0,
  
  setCameraTarget: (target) => set((state) => ({ cameraTarget: { ...state.cameraTarget, ...target } })),
  setCameraLookAt: (lookAt) => set((state) => ({ cameraLookAt: { ...state.cameraLookAt, ...lookAt } })),
  setSceneState: (newState) => set((state) => ({ ...state, ...newState }))
}))
