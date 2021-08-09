import {Box, Typography} from '@material-ui/core'
import PropTypes from 'prop-types'
import React from 'react'

export const Content = ({isSearchDone, repoList, children}) => {
  if (isSearchDone && !!repoList.length) {
    return children
  }

  if (isSearchDone && !repoList.length) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={400}
        width="100%"
      >
        <Typography>You search has no results</Typography>
      </Box>
    )
  }

  return (
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
}

export default Content

Content.propTypes = {
  isSearchDone: PropTypes.bool.isRequired,
}
