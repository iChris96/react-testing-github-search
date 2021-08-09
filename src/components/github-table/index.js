import React from 'react'

import {
  Avatar,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'

const TABLE_HEADERS = [
  'Repository',
  'Stars',
  'Forks',
  'Open issues',
  'Updated at',
]

const GithubTable = ({repoList}) => (
  <TableContainer style={{maxHeight: 640}}>
    <Table stickyHeader>
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
)

export default GithubTable
