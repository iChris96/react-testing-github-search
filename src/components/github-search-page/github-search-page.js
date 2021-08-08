import {Button, Container, Grid, TextField, Typography} from '@material-ui/core'
import React, {useState} from 'react'
import {getGitRepose} from '../../services'
import {Content} from '../content'

const GithubSearchPage = () => {
  const title = 'github repositories list'

  const [isSearching, setIsSearching] = useState(false)
  const [isSearchDone, setIsSearchDone] = useState(false)
  const [repoList, setRepoList] = useState([])

  const handleClick = async () => {
    setIsSearching(true)
    const response = await getGitRepose()
    const data = await response.json()
    setRepoList(data.items)
    setIsSearching(false)
    setIsSearchDone(true)
  }

  return (
    <Container>
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item md={6} xs={12}>
          <TextField fullWidth label="Filter by" id="filterBy" />
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
        <Content isSearchDone={isSearchDone} repoList={repoList} />
      </Grid>
    </Container>
  )
}

export default GithubSearchPage
