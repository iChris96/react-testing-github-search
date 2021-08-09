import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    this.state = {hasError: false}
  }

  static getDerivedStateFromError() {
    return {hasError: true}
  }

  handleOnClick = () => window.location.reload()

  render() {
    const {children} = this.props
    const {hasError} = this.state
    if (hasError) {
      return (
        <>
          <h1>There is an unexpected error</h1>
          <button type="button" onClick={this.handleOnClick}>
            reload app
          </button>
        </>
      )
    }
    return children
  }
}

export default ErrorBoundary
