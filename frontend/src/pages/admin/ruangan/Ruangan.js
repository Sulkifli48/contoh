import React, { useState, useRef } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";
import { MdDelete } from "react-icons/md";
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Modal, TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import {  
  MRT_GlobalFilterTextField as MRT_GLOBAL_FILTER_TEXT_FIELD,
  MRT_TableBodyCellValue as MRT_TABLE_BODY_CELL_VALUE, 
  MRT_TablePagination as MRT_TABLE_PAGINATION,
  flexRender, 
  useMaterialReactTable 
} from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { initialRuangan } from '../../../assets/mockdata/dataRuangan';

const Ruangan = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ruanganToDelete, setRuanganToDelete] = useState({ id: '', namaRuangan: '' });
  const [confirmationText, setConfirmationText] = useState('');
  const [ruanganData, setRuanganData] = useState({
    nama: '',
    kapasitas: '',
  });

  const kapasitasRef = useRef();
  const [ruangans, setRuangans] = useState(initialRuangan);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRuanganData({ ...ruanganData, [name]: value });
  };

  const handleAddRuangan = (e) => {
    e.preventDefault();
    setRuangans([{ ...ruanganData, createdAt: Date.now() }, ...ruangans]);
    setRuanganData({
      nama: '',
      kapasitas: '',
    });
    setIsAddModalOpen(false);
  };

  const handleDeleteRuangan = (ruanganId, nama) => {
    setRuanganToDelete({ id: ruanganId, nama });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setRuangans(ruangans.filter(ruangan => ruangan.id !== ruanganToDelete.id));
    setIsDeleteDialogOpen(false);
  };

  const columns = [
    { accessorKey: 'nama', header: 'Nama Ruangan' },
    { accessorKey: 'kapasitas', header: 'Kapasitas' },
    {
      accessorKey: "action",
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <MdDelete color='red' size={20} onClick={() => handleDeleteRuangan(row.original.id, row.original.nama)} />
        </div>
      ),
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: ruangans,
    enableRowSelection: false,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      showGlobalFilter: true,
    },
    muiPaginationProps: {
      rowsPerPageOptions: [10, 15, 20, 25, 30, 35],
      variant: 'outlined',
    },
    paginationDisplayMode: 'pages',
  });

  return (
    <div className='bg-db'>
      <Sidebar />
      <div className='dashboard'>
        <div className='card-list-ruangan'>
          <h1>Daftar Ruangan</h1>
          <Stack>
            <TableContainer className='border-list-ruangan'>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
                <button
                  style={{ width: '190px', height: '40px', background: '#3F72AF', borderRadius: '40px', color: 'white', fontWeight: 500 }}
                  onClick={handleOpenAddModal}
                >
                  Add Ruangan
                </button>
                <MRT_GLOBAL_FILTER_TEXT_FIELD table={table} />
              </Box>
              <Table>
                <TableHead className='border-botton'>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <TableCell align="center" variant="head" key={header.id}>
                          <span style={{ fontWeight: 'bold', fontSize: "15px" }}>
                            {flexRender(header.column.columnDef.Header ?? header.column.columnDef.header, header.getContext())}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell align="center" key={cell.id}>
                          <MRT_TABLE_BODY_CELL_VALUE cell={cell} table={table} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <MRT_TABLE_PAGINATION table={table} />
          </Stack>
        </div>

        <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Ruangan</DialogTitle>
          <DialogContent>
            <Typography>To confirm deletion, please enter: "delete-{ruanganToDelete.nama}"</Typography>
            <TextField fullWidth label="Confirmation Text" value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleConfirmDelete}>Delete</Button>
          </DialogActions>
        </Dialog>

        <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 500 }}>
            <Typography variant="h6">Add Ruangan
              <IconButton onClick={handleCloseAddModal} style={{ float: 'right' }}><CloseIcon color='primary' /></IconButton>
            </Typography>
            <form onSubmit={handleAddRuangan}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Nama Ruangan" name="nama" value={ruanganData.nama} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Kapasitas" name="kapasitas" type="number" value={ruanganData.kapasitas} onChange={handleChange} inputRef={kapasitasRef} required />
                </Grid>
              </Grid>
              <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Add</Button>
            </form>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Ruangan;
