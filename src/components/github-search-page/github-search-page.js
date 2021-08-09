import {
  Button,
  Container,
  Grid,
  TablePagination,
  TextField,
  Typography,
} from '@material-ui/core'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {getGitRepose} from '../../services'
import {Content} from '../content'
import GithubTable from '../github-table'

const ROWS_PER_PAGE = 30

const GithubSearchPage = () => {
  const title = 'github repositories list'

  const [isSearching, setIsSearching] = useState(false)
  const [isSearchDone, setIsSearchDone] = useState(false)
  const [repoList, setRepoList] = useState([])
  const [searchBy, setSearchBy] = useState('react')
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE)

  const didMount = useRef(false)

  const handleClick = useCallback(async () => {
    setIsSearching(true)
    const response = await getGitRepose({q: searchBy, rowsPerPage})
    const data = await response.json()
    setRepoList(data.items)
    setIsSearching(false)
    setIsSearchDone(true)
  }, [rowsPerPage, searchBy])

  const handleFilterByChange = ({target: {value}}) => setSearchBy(value)
  const handleOnPageChange = event => setRowsPerPage(event.target.value)

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
            value={searchBy}
            onChange={handleFilterByChange}
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
            count={1}
            rowsPerPage={rowsPerPage}
            page={0}
            onPageChange={() => {}}
            onRowsPerPageChange={handleOnPageChange}
          />
        </Content>
      </Grid>
    </Container>
  )
}

export default GithubSearchPage
