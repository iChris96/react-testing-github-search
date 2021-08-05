import {
  Avatar,
  Box,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@material-ui/core'
import React from 'react'
import PropTypes from 'prop-types'

const TABLE_HEADERS = [
  'Repository',
  'Stars',
  'Forks',
  'Open issues',
  'Updated at',
]

export const Content = ({isSearchDone}) =>
  isSearchDone ? (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {TABLE_HEADERS.map(it => (
                <TableCell key={it}>{it}</TableCell>
              ))}
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
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[30, 50, 100]}
        component="div"
        count={1}
        rowsPerPage={30}
        page={0}
        onPageChange={() => {}}
      />
    </>
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
