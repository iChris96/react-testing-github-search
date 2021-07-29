import {
  Avatar,
  Box,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import React from 'react'
import PropTypes from 'prop-types'

export const Content = ({isSearchDone}) =>
  isSearchDone ? (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Repository</TableCell>
          <TableCell>Stars</TableCell>
          <TableCell>Forks</TableCell>
          <TableCell>Open issues</TableCell>
          <TableCell>Updated at</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <Avatar alt="myimg" src="/logo192.png" />
            <Link href="http://localhost:3000">Test</Link>
          </TableCell>
          <TableCell>10</TableCell>
          <TableCell>5</TableCell>
          <TableCell>2</TableCell>
          <TableCell>2020-01-01</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>NotionApp</TableCell>
          <TableCell>10</TableCell>
          <TableCell>5</TableCell>
          <TableCell>2</TableCell>
          <TableCell>2020-01-01</TableCell>
        </TableRow>
      </TableBody>
    </Table>
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

export default Content

Content.propTypes = {
  isSearchDone: PropTypes.bool.isRequired,
}
