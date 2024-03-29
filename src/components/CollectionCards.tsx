import { useState } from 'react';
import {
  IconButton,
  Container,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { Edit, Delete, Cancel, Check } from '@mui/icons-material/';
import useQuantity from '../hooks/useQuantity';

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

function CollectionCards({
  row,
  deleteCard,
  deleteModalOpen,
  handleDeleteModal,
  refetch,
}) {
  const [cardModalOpen, setCardModalOpen] = useState<boolean>(false);

  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [card, setCard] = useState<any>({
    scry_id: row.scry_id,
    quantity: 0,
  });

  const { mutate } = useQuantity(card, row.scry_id);

  async function editCard(row: any) {
    setCard({
      ...card,
      scry_id: row.scry_id,
      quantity: newQuantity,
    });
    mutate(card);
    setCardModalOpen(false);
    setTimeout(() => {
      refetch();
    }, 1500);
  }

  return (
    <>
      <TableRow
        key={row.scry_id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {row.card_name}
        </TableCell>
        <TableCell>{'$' + row.price}</TableCell>
        <TableCell>{row.quantity}</TableCell>
        <TableCell>
          <IconButton onClick={() => setCardModalOpen(true)}>
            <Edit fontSize="medium" />
          </IconButton>
          <Dialog open={cardModalOpen}>
            <DialogTitle id="alert-dialog-title" align="center">
              {'Card Details'}
            </DialogTitle>
            <DialogContent>
              <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                <CardMedia
                  component="img"
                  alt="card picture"
                  image={row.image_uris.small}
                  sx={{ width: 150, marginBottom: 3 }}
                />
                <Typography
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 0.5,
                  }}
                >
                  <span>{message}</span>
                </Typography>
              </Container>
              <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                <TextField
                  type="number"
                  label="Quantity"
                  variant="outlined"
                  defaultValue={row.quantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                  sx={{ width: '4.5rem' }}
                />
                <DialogActions
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <IconButton onClick={editCard}>
                    <Check />
                  </IconButton>
                  <IconButton onClick={() => setCardModalOpen(false)} autoFocus>
                    <Cancel />
                  </IconButton>
                </DialogActions>
              </Container>
            </DialogContent>
          </Dialog>
          <IconButton onClick={() => handleDeleteModal(true)}>
            <Delete fontSize="medium" />
          </IconButton>
          <Dialog open={deleteModalOpen}>
            <DialogTitle id="alert-dialog-title">{'Delete Entry'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you would like to delete this entry?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <IconButton onClick={() => handleDeleteModal(false)} autoFocus>
                <Cancel />
              </IconButton>
              <IconButton onClick={() => deleteCard(row)}>
                <Check />
              </IconButton>
            </DialogActions>
          </Dialog>
        </TableCell>
      </TableRow>
    </>
  );
}

export default CollectionCards;
