import React, {useState} from 'react'
import {
  TextField,
  Typography,
  Button,
  Grid,
  Container,
  Box,
} from '@material-ui/core'

const GithubSearchPage = () => {
  const title = 'github repositories list'

  const [isSearching, setIsSearching] = useState(false)
  const [isSearchDone, setIsSearchDone] = useState(false)

  const handleClick = async () => {
    setIsSearching(true)
    await Promise.resolve()
    setIsSearching(false)
    setIsSearchDone(true)
  }

  const renderContent = () =>
    isSearchDone ? (
      <table>
        <thead>
          <tr>
            <th>Repository</th>
            <th>Stars</th>
            <th>Forks</th>
            <th>Open issues</th>
            <th>Updated at</th>
          </tr>
        </thead>
      </table>
    ) : (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={400}
        width="100%"
      >
        <Typography>
          Please provide a search option and click in the search button
        </Typography>
      </Box>
    )

  return (
    <Container>
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      <Grid container spacing={2} justify="space-between">
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
        {renderContent()}
      </Grid>
    </Container>
  )
}

export default GithubSearchPage
