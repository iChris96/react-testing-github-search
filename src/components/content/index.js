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

export const Content = ({isSearchDone, repoList}) =>
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
            {repoList.map(
              ({
                name,
                id,
                stargazers_count: stargazersCount,
                forks_count: forksCount,
                open_issues_count: openIssuesCount,
                updated_at: updatedAt,
                owner: {avatar_url: avatarUrl},
                html_url: htmlUrl,
              }) => (
                <TableRow key={id}>
                  <TableCell>
                    <Avatar alt={name} src={avatarUrl} />
                    <Link href={htmlUrl}>{name}</Link>
                  </TableCell>
                  <TableCell>{stargazersCount}</TableCell>
                  <TableCell>{forksCount}</TableCell>
                  <TableCell>{openIssuesCount}</TableCell>
                  <TableCell>{updatedAt}</TableCell>
                </TableRow>
              ),
            )}
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
