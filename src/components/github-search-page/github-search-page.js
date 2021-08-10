import {
  Button,
  Container,
  Grid,
  Snackbar,
  TablePagination,
  TextField,
  Typography,
} from '@material-ui/core'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {getGitRepose} from '../../services'
import {Content} from '../content'
import GithubTable from '../github-table'

const ROWS_PER_PAGE = 30
const INITIAL_ACTUAL_PAGE = 0
const INITIAL_TOTAL_COUNT = 0

const GithubSearchPage = () => {
  const title = 'github repositories list'

  const [isSearching, setIsSearching] = useState(false)
  const [isSearchDone, setIsSearchDone] = useState(false)
  const [repoList, setRepoList] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE)
  const [actualPage, setActualPage] = useState(INITIAL_ACTUAL_PAGE)
  const [totalCount, setTotalCount] = useState(INITIAL_TOTAL_COUNT)
  const [isSnackOpen, setIsSnackOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const didMount = useRef(false)
  const searchBy = useRef(null)

  const handleClick = useCallback(async () => {
    try {
      setIsSearching(true)
      const response = await getGitRepose({
        q: searchBy.current.value,
        rowsPerPage,
        actualPage,
      })

      if (!response.ok) {
        // response.ok -> 200..299 status code
        throw response
      }

      const data = await response.json()
      setRepoList(data.items)
      setIsSearching(false)
      setTotalCount(data.total_count)
    } catch (err) {
      const data = await err.json()
      setIsSnackOpen(true)
      setErrorMsg(data.msg)
    } finally {
      setIsSearchDone(true)
    }
  }, [rowsPerPage, actualPage])

  const handleOnPerPageChange = event => {
    setRowsPerPage(event.target.value)
    setActualPage(INITIAL_ACTUAL_PAGE)
  }
  const handleOnPageChange = (event, newPage) => setActualPage(newPage)

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    handleClick()
  }, [rowsPerPage, handleClick])

  return (
    <Container>
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            label="Filter by"
            id="filterBy"
            inputRef={searchBy}
          />
        </Grid>

        <Grid item md={2} xs={12}>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            onClick={handleClick}
            disabled={isSearching}
          >
            Search
          </Button>
        </Grid>
        <Content isSearchDone={isSearchDone} repoList={repoList}>
          <GithubTable repoList={repoList} />
          <TablePagination
            rowsPerPageOptions={[30, 50, 100]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={actualPage}
            onPageChange={handleOnPageChange}
            onRowsPerPageChange={handleOnPerPageChange}
          />
        </Content>
      </Grid>
      <Snackbar open={isSnackOpen} message={errorMsg} />
    </Container>
  )
}

export default GithubSearchPage
