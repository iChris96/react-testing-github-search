import React from 'react'
import {TextField, Typography, Button} from '@material-ui/core'

const GithubSearchPage = () => {
  const title = 'github repositories list'

  return (
    <>
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      <TextField label="Filter by" id="filterBy" />
      <Button>Search</Button>
    </>
  )
}

export default GithubSearchPage
