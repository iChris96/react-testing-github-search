import repos30Paginated from './repos-30-paginated.json'
import repos50Paginated from './repos-50-paginated.json'

export const makeFakeResponse = ({totalCount = 1000, items = []} = {}) => ({
  total_count: totalCount,
  items,
})

export const makeFakeRepo = ({
  name = 'django-rest-framework-reactive',
  id = '56757919',
} = {}) => ({
  id,
  name,
  owner: {
    avatar_url: 'https://avatars0.githubusercontent.com/u/2120224?v=4',
  },
  html_url: 'https://github.com/genialis/django-rest-framework-reactive',
  updated_at: '2020-10-24',
  stargazers_count: 58,
  forks_count: 9,
  open_issues_count: 0,
})

const reposData = ['go', 'freeCodeCamp', 'laravel', 'Python', 'Java']

const reposList = reposData.map(name => makeFakeRepo({name, id: name}))

export const getReposListBy = ({name}) =>
  reposList.filter(repo => repo.name === name)

export const getReposPerPage = ({currentPage, perPage}) =>
  perPage === 30 ? repos30Paginated[currentPage] : repos50Paginated[currentPage]

const TOTAL_COUNT = 1
export const fakeResponse = makeFakeResponse({
  totalCount: TOTAL_COUNT,
  items: [makeFakeRepo(), {...makeFakeRepo(), id: '12345'}],
})

export const fakeRepo = makeFakeRepo()

export default {
  makeFakeResponse,
  makeFakeRepo,
  getReposListBy,
  getReposPerPage,
  fakeResponse,
  fakeRepo,
}
