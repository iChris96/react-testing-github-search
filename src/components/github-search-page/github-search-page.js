import React, {useState} from 'react'
import {
  TextField,
  Typography,
  Button,
  Grid,
  Container,
  Box,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Link,
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
              <img alt="myimg" src="/logo192.png" />
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
        {renderContent()}
      </Grid>
    </Container>
  )
}

export default GithubSearchPage
