const baseUrl =
  process.env.NODE_ENV === 'test' ? '' : process.env.REACT_APP_BASE_URL

export const getGitRepose = async ({q, rowsPerPage, actualPage}) =>
  fetch(
    `${baseUrl}/search/repositories?q=${
      q || 'react'
    }&page=${actualPage}&per_page=${rowsPerPage}`,
  )

export default {
  getGitRepose,
}
