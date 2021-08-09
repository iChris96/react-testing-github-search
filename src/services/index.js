const baseUrl =
  process.env.NODE_ENV === 'test' ? '' : process.env.REACT_APP_BASE_URL

export const getGitRepose = async ({q, rowsPerPage}) =>
  fetch(
    `${baseUrl}/search/repositories?q=${
      q || 'react'
    }&page=0&per_page=${rowsPerPage}`,
  )

export default {
  getGitRepose,
}
