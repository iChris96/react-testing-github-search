import React from 'react'
import ErrorBoundary from './components/error-boundary/error-boundary'
import GithubSearchPage from './components/github-search-page'

function App() {
  return (
    <div>
      <ErrorBoundary>
        <GithubSearchPage />
      </ErrorBoundary>
    </div>
  )
}

export default App
