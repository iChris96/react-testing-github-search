import {fireEvent, render, screen} from '@testing-library/react'
import ErrorBoundary from './error-boundary'

jest.spyOn(console, 'error') // hide console error in logs for: The above error occurred in the <ThrowError> component:

describe('when the componenet works without errors', () => {
  beforeEach(() =>
    render(
      <ErrorBoundary>
        <h1>test pass</h1>
      </ErrorBoundary>,
    ),
  )

  it('must render the component content', () => {
    expect(screen.getByText(/test pass/i)).toBeInTheDocument()
  })
})

const ThrowError = () => {
  throw new Error('ups')
}

describe('when the componenet throws an error', () => {
  beforeEach(() =>
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    ),
  )

  it('must render the message "There is an unexpected error" and the reload button', () => {
    const errorMessage = screen.getByText(/there is an unexpected error/i)
    expect(errorMessage).toBeInTheDocument()

    const reloadBtn = screen.getByRole('button', {name: /reload app/i})
    expect(reloadBtn).toBeInTheDocument()
  })
})

describe('when the user clicks on reload button', () => {
  beforeEach(() =>
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    ),
  )

  it('must reload the app', () => {
    delete window.location
    window.location = {reload: jest.fn()} // override reload funct for window obj

    const reloadBtn = screen.getByRole('button', {name: /reload app/i})
    fireEvent.click(reloadBtn)

    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})
