import React from 'react'
import {
  fireEvent,
  getByRole,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
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

  it('the data should be displayed as a sticky table', async () => {
    const button = screen.getByRole('button', {name: /search/i})
    const message = screen.queryByText(
      /please provide a search option and click in the search button/i,
    ) // getByText >throw a descriptive error if no elements match // queryByText > return null if no elements match.

    expect(message).toBeInTheDocument()

    fireEvent.click(button)

    await waitFor(() => expect(message).not.toBeInTheDocument())

    const table = screen.getByRole('table')

    expect(table).toBeInTheDocument()
  })

  it('the header table must contain: Repository, stars, forks, open issues and updated at', async () => {
    const button = screen.getByRole('button', {name: /search/i})
    fireEvent.click(button)

    const table = await screen.findByRole('table') // 'findBy' querys retuns a promise,..so lets await until table is mounted

    expect(table).toBeInTheDocument()

    // within > find only inside received node, in this case will only search for columnheader inside table node
    // getAllByRole > this returns an array of elements
    const tableHeaders = within(table).getAllByRole('columnheader')

    expect(tableHeaders).toHaveLength(5)

    expect(tableHeaders[0]).toHaveTextContent(/repository/i)
    expect(tableHeaders[1]).toHaveTextContent(/stars/i)
    expect(tableHeaders[2]).toHaveTextContent(/forks/i)
    expect(tableHeaders[3]).toHaveTextContent(/open issues/i)
    expect(tableHeaders[4]).toHaveTextContent(/updated at/i)
  })
})
