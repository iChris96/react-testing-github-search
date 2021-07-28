import React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import GithubSearchPage from './github-search-page'

describe('when the GithubSearchPage is mounted', () => {
  beforeEach(() => render(<GithubSearchPage />))

  it('must display the title', () => {
    expect(
      screen.getByRole('heading', {name: /github repositories list/i}),
    ).toBeInTheDocument()
  })

  it('An input text with label "filter by" field in order to do the search', () => {
    const input = screen.getByLabelText(/filter by/i)

    expect(input).toBeInTheDocument()
  })

  it('Must be a Seach Button', () => {
    const button = screen.getByRole('button', {name: /search/i})

    expect(button).toBeInTheDocument()
  })

  it('Must be an initial state message “Please provide a search option and click in the search button”', () => {
    const message = screen.getByText(
      /please provide a search option and click in the search button/i,
    )

    expect(message).toBeInTheDocument()
  })
})

describe('when the user does a search', () => {
  beforeEach(() => render(<GithubSearchPage />))

  it('the search button should be disabled until the search is done', async () => {
    const button = screen.getByRole('button', {name: /search/i})

    expect(button).not.toBeDisabled()

    fireEvent.click(button)

    await waitFor(() => expect(button).not.toBeDisabled())
  })
})
