import React from 'react'
import {
  fireEvent,
  render,
  screen,
  wait,
  waitFor,
  within,
} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import GithubSearchPage from './github-search-page'

import {
  makeFakeResponse,
  makeFakeRepo,
  getReposListBy,
  getReposPerPage,
} from '../../__fixtures__/repos'

const TOTAL_COUNT = 1
const fakeResponse = makeFakeResponse({totalCount: TOTAL_COUNT})

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

describe.skip('when the user does a search', () => {
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

describe('when the developer types on filter by and does a seach', () => {
  beforeEach(() => render(<GithubSearchPage />))

  it('must display the related repos', async () => {
    // setup the mock server
    const expectedRepoName = 'laravel'
    const expectedFirstRepo = getReposListBy({name: expectedRepoName})[0]

    server.use(
      rest.get('/search/repositories', (req, res, ctx) => {
        const defaultResponse = makeFakeResponse()
        const repoName = req.url.searchParams.get('q')
        const customResponse = {
          ...defaultResponse,
          items: getReposListBy({name: repoName}),
        }
        return res(ctx.status(200), ctx.json(customResponse))
      }),
    )

    // type for a word in filter by input
    const filterByInput = screen.getByLabelText(/filter by/i)
    fireEvent.change(filterByInput, {target: {value: expectedRepoName}})

    // click on search
    fireClickSearch()

    // expect the table content

    const table = await screen.findByRole('table')

    const tableCells = within(table).getAllByRole('cell')

    const [repository] = tableCells

    expect(table).toBeInTheDocument()

    expect(repository).toHaveTextContent(expectedFirstRepo.name)
  })
})

describe.skip('when the user does a search and selects 50 rows per page', () => {
  beforeEach(() => render(<GithubSearchPage />))

  it('must fetch a new search and display 50 results on the table', async () => {
    // config mock server response
    server.use(
      rest.get('/search/repositories', (req, res, ctx) => {
        const defaultResponse = makeFakeResponse()
        const perPage = Number(req.url.searchParams.get('per_page'))
        const currentPage = Number(req.url.searchParams.get('page'))
        const customResponse = {
          ...defaultResponse,
          items: getReposPerPage({perPage, currentPage}),
        }
        return res(ctx.status(200), ctx.json(customResponse))
      }),
    )

    // click search
    fireClickSearch()

    // expect 30 rows length
    const table = await screen.findByRole('table')
    expect(table).toBeInTheDocument()
    const rows31 = await screen.getAllByRole('row')
    expect(rows31).toHaveLength(31) // headers also count as a row

    // select 50 per page
    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))
    fireEvent.click(screen.getByRole('option', {name: '50'}))

    // expect 50 rows length

    await waitFor(
      () =>
        expect(
          screen.getByRole('button', {name: /search/i}),
        ).not.toBeDisabled(),
      {timeout: 3000},
    )
    const rows51 = await screen.getAllByRole('row')
    expect(rows51).toHaveLength(51)
  })
})

describe.skip('when the user click on search and then on next page button', () => {
  beforeEach(() => render(<GithubSearchPage />))

  it('must display the next repositories page', async () => {
    // config server handler
    server.use(
      rest.get('/search/repositories', (req, res, ctx) => {
        const defaultResponse = makeFakeResponse()
        const perPage = Number(req.url.searchParams.get('per_page'))
        const currentPage = Number(req.url.searchParams.get('page'))
        const customResponse = {
          ...defaultResponse,
          items: getReposPerPage({perPage, currentPage}),
        }
        return res(ctx.status(200), ctx.json(customResponse))
      }),
    )
    // click search
    fireClickSearch()

    // wait table
    const table = await screen.findByRole('table')
    expect(table).toBeInTheDocument()

    // expect first repo name is from page 0
    const repoCell = screen.getByRole('cell', {name: /1-0/i})
    expect(repoCell).toBeInTheDocument()

    // expect next page is not disabled
    const nextPageBtn = screen.getByRole('button', {name: /next page/i})
    expect(nextPageBtn).not.toBeDisabled()

    // click next page button
    fireEvent.click(nextPageBtn)

    // wait search button is not disabled
    const searchBtn = screen.getByRole('button', {name: /search/i})
    expect(searchBtn).toBeDisabled()

    await waitFor(() => expect(searchBtn).not.toBeDisabled(), {timeout: 3000})

    // expect first repo name is from page 1
    const repoCell2 = screen.getByRole('cell', {name: /2-0/i})
    expect(repoCell2).toBeInTheDocument()

    // click previous page
    const previousPageBtn = screen.getByRole('button', {name: /previous page/i})
    fireEvent.click(previousPageBtn)

    // wait search finish
    await waitFor(() => expect(searchBtn).not.toBeDisabled(), {timeout: 3000})

    // expect first repo name is from page 0
    const repoCell3 = screen.getByRole('cell', {name: /1-0/i})
    expect(repoCell3).toBeInTheDocument()
  }, 10000)
})

describe('when there is an error from backend', () => {
  beforeEach(() => render(<GithubSearchPage />))

  it('must display an alert message if is validation error', async () => {
    // message should not be in the document
    expect(screen.queryByText(/validation failed/i)).not.toBeInTheDocument()

    // config server handler
    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(ctx.status(422), ctx.json({msg: 'validation failed'})),
      ),
    )

    // click search
    fireClickSearch()

    // expect message
    const errorMsg = await screen.findByText(/validation failed/i)
    expect(errorMsg).toBeVisible()
  })

  it('must display an alert message if is unexpected error', async () => {
    // message should not be in the document
    expect(screen.queryByText(/unexpected error/i)).not.toBeInTheDocument()

    // config server handler
    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({msg: 'unexpected error'})),
      ),
    )

    // click search
    fireClickSearch()

    // expect message
    const errorMsg = await screen.findByText(/unexpected error/i)
    expect(errorMsg).toBeVisible()
  })
})
