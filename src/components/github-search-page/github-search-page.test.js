import React from 'react'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import GithubSearchPage from './github-search-page'

import {makeFakeResponse, makeFakeRepo} from '../../__fixtures__/repos'

const fakeResponse = makeFakeResponse({totalCount: 1})

const fakeRepo = makeFakeRepo()

fakeResponse.items = [fakeRepo, {...fakeRepo, id: '12345'}]

const server = setupServer(
  rest.get('/search/repositories', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(fakeResponse)),
  ),
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

const fireClickSearch = () => {
  const button = screen.getByRole('button', {name: /search/i})
  fireEvent.click(button)
}

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

  it('each table result must contain: repository name, starts, forks, open issue, updated at', async () => {
    fireClickSearch()

    const table = await screen.findByRole('table')

    // within > find only inside received node, in this case will only search for columnheader inside table node
    // getAllByRole > this returns an array of elements
    const tableCells = within(table).getAllByRole('cell')

    expect(tableCells).toHaveLength(10)

    const [repository, stars, forks, openIssues, updatedAt, repository2] =
      tableCells

    expect(repository).toHaveTextContent(fakeRepo.name)
    expect(stars).toHaveTextContent(fakeRepo.stargazers_count)
    expect(forks).toHaveTextContent(fakeRepo.forks_count)
    expect(openIssues).toHaveTextContent(fakeRepo.open_issues_count)
    expect(updatedAt).toHaveTextContent(fakeRepo.updated_at)
    expect(repository2).toHaveTextContent(fakeRepo.name) //  repository2 is the first element from second row
  })

  it('repository result should have an image', async () => {
    fireClickSearch()

    const table = await screen.findByRole('table')
    const tableCells = within(table).getAllByRole('cell')

    const firstRowRepositoryValue = tableCells[0]

    const img = within(firstRowRepositoryValue).getByRole('img', {
      name: fakeRepo.name,
    })

    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', fakeRepo.owner.avatar_url)
  })

  it('some result should have a hyper link', async () => {
    fireClickSearch()

    const table = await screen.findByRole('table')

    // closest > Returns the first (starting at element) inclusive ancestor that matches selectors, and null otherwise.
    const link = within(table).getAllByText(fakeRepo.name)[0].closest('a')

    expect(link).toHaveAttribute('href', fakeRepo.html_url)
  })

  it('must display the total results number of search and the current number of results', async () => {
    fireClickSearch()

    await screen.findByRole('table') // await until table is rendered
    const pageText = screen.getByText(/1-1 of 1/i)

    expect(pageText).toBeInTheDocument()
  })

  it('results size per page select/combobox with the options: 30, 50, 100. The default is 30.', async () => {
    fireClickSearch()

    await screen.findByRole('table') // await until table is rendered

    const pageSelector = screen.getByLabelText(/rows per page/i)
    expect(pageSelector).toBeInTheDocument()

    fireEvent.mouseDown(pageSelector) // display option values

    const listBox = screen.getByRole('listbox', {name: /rows per page/i}) // options container

    const options = within(listBox).getAllByRole('option')

    const [op1, op2, op3] = options

    expect(op1).toHaveTextContent(/30/)
    expect(op2).toHaveTextContent(/50/)
    expect(op3).toHaveTextContent(/100/)
  })

  it('must exists the next and previous pagination button', async () => {
    fireClickSearch()

    await screen.findByRole('table') // await until table is rendered

    const previousPageBtn = screen.getByRole('button', {name: /previous page/i})

    expect(previousPageBtn).toBeInTheDocument()

    const nextPageBtn = screen.getByRole('button', {name: /next page/i})

    expect(nextPageBtn).toBeInTheDocument()

    expect(nextPageBtn).toBeDisabled()
  })
})

describe('when user does a serach without results', () => {
  beforeEach(() => render(<GithubSearchPage />))

  it('must be a empty state message: "You search has no results"', async () => {
    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            total_count: 0,
            incomplete_results: false,
            items: [],
          }),
        ),
      ),
    )

    fireClickSearch()

    await waitFor(() =>
      expect(
        screen.getByText(/you search has no results/i),
      ).toBeInTheDocument(),
    )

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
