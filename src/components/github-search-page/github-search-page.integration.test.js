import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import React from 'react'
import {
  getReposPerPage,
  makeFakeResponse,
  fakeResponse,
} from '../../__fixtures__/repos'
import GithubSearchPage from './github-search-page'

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

describe('when the user does a search and selects 50 rows per page', () => {
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
  }, 10000)
})

describe('when the user click on search and then on next page button', () => {
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
  }, 15000)
})
