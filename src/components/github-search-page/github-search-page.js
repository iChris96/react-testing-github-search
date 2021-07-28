import React from 'react'
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
          <Button fullWidth color="primary" variant="contained">
            Search
          </Button>
        </Grid>

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
      </Grid>
    </Container>
  )
}

export default GithubSearchPage
