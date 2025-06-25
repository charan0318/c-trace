'use client'

import { useState, useEffect } from 'react'
import { BlockchainExplorer } from '@/app/components/BlockchainExplorer'
import LoadingScreen from '@/app/components/LoadingScreen'

export default function ExplorerPage() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <div className="h-screen">
      {isLoading ? (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      ) : (
        <BlockchainExplorer />
      )}
    </div>
  )
}

