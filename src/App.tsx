import { useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AppRouter } from '@/routes'
import { GlobalLoader } from '@/components/GlobalLoader'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <HelmetProvider>
      <ThemeProvider>
        {!isLoaded && <GlobalLoader onComplete={() => setIsLoaded(true)} />}
        <AppRouter />
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
