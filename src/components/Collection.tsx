import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Header from './Header';
import CollectionCards from './CollectionCards';
import LogoutModal from './LogoutModal';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

// TS Interface for data from GET request
interface AccountCards {
  id: number;
  account_id: string;
  scry_id: string;
  card_name: string;
  price: string;
  quantity: number;
  image_uris: string;
}

function Collection() {
  const [message, setMessage] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const baseURL = import.meta.env.VITE_APIURL;
  const token = localStorage.getItem('accessToken');

  async function getAccountCards() {
    const response = await fetch(`${baseURL}/api/v1/account/cards`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`${error?.message}`);
    }
    const commits = await response.json();
    return commits;
  }

  async function deleteCard(row: any) {
    const response = await fetch(
      `${baseURL}/api/v1/account/cards/${row.scry_id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`There was a problem: ${response.status}`);
    }
    const commits = await response.json();
    setDeleteModalOpen(false);
    manageMessage(commits?.results)
    refetch();
  }

  const { isLoading, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ['card'],
    queryFn: getAccountCards,
  });

  function manageMessage(content) {
    setMessage(content);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  }

  function handleDeleteModal(bool: boolean) {
    setDeleteModalOpen(bool);
  }

  return (
    <>
      <Header />
      <Typography
        sx={{ display: 'flex', justifyContent: 'center', padding: 0.5 }}
      >
        <span>{message}</span>
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Card</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Qty</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data ? (
              data.map((row: any) => (
                <CollectionCards
                  row={row}
                  deleteModalOpen={deleteModalOpen}
                  deleteCard={deleteCard}
                  handleDeleteModal={handleDeleteModal}
                  refetch={refetch}
                />
              ))
            ) : isLoading || isFetching ? (
              <TableRow>
                <TableCell>Loading...</TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell>Error: {error?.message}</TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <LogoutModal />
    </>
  )
}

export default Collection;
