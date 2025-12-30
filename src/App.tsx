import React, { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import { Scene1Intro } from './scenes/Scene1Intro'
import { Scene2PhotoUpload } from './scenes/Scene2PhotoUpload'
import { Scene3FrameExperience } from './scenes/Scene3FrameExperience'
import { Scene4MagicTouches } from './scenes/Scene4MagicTouches'
import { Scene5Export } from './scenes/Scene5Export'
import { AudioToggle } from './components/AudioToggle'

const SceneRouter: React.FC = () => {
  const { currentScene } = useApp()

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to go back (except from intro)
      if (e.key === 'Escape' && currentScene !== 'intro') {
        // Could add back navigation logic here if needed
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentScene])

  const renderScene = () => {
    switch (currentScene) {
      case 'intro':
        return <Scene1Intro key="intro" />
      case 'upload':
        return <Scene2PhotoUpload key="upload" />
      case 'frame':
        return <Scene3FrameExperience key="frame" />
      case 'magic':
        return <Scene4MagicTouches key="magic" />
      case 'export':
        return <Scene5Export key="export" />
      default:
        return <Scene1Intro key="intro" />
    }
  }

  return (
    <div className="h-full w-full overflow-hidden" role="main">
      <AnimatePresence mode="wait">
        {renderScene()}
      </AnimatePresence>
      <AudioToggle />
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <SceneRouter />
    </AppProvider>
  )
}

export default App

