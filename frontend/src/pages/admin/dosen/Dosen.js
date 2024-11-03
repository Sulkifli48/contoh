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
  useMaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { initialDosen } from '../../../assets/mockdata/dataDosen';

const Dosen = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dosenToDelete, setDosenToDelete] = useState({ id: '', name: '' });
  const [confirmationText, setConfirmationText] = useState('');

  const [dosenData, setDosenData] = useState({
    nip: '',
    nama: '',
    bidang: '', // Changed from 'status' to 'bidang'
  });

  const nipRef = useRef();
  const namaRef = useRef();
  const bidangRef = useRef(); // Updated reference name
  const [dosens, setDosens] = useState(initialDosen);

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
    setDosenData({ ...dosenData, [name]: value });
  };

  const handleAddDosen = (e) => {
    e.preventDefault();
    setDosens([{ ...dosenData, id: Date.now(), createdAt: Date.now() },...dosens]); 
    setDosenData({
      nip: '',
      nama: '',
      bidang: '', 
    });
    setIsAddModalOpen(false);
  };

  const handleDeleteDosen = (dosenId, nama) => {
    setDosenToDelete({ id: dosenId, nama });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setDosens(dosens.filter(dosen => dosen.id !== dosenToDelete.id));
    setIsDeleteDialogOpen(false);
  };

  const columns = [
    { accessorKey: 'nip', header: 'Nip' },
    { accessorKey: 'nama', header: 'Nama' },
    { accessorKey: 'bidang', header: 'Bidang' }, 
    {
      accessorKey: "action",
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <MdDelete color='red' size={20} onClick={() => handleDeleteDosen(row.original.id, row.original.name)} />
        </div>
      ),
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: dosens,
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
        <div className='card-list-matakuliah'>
          <h1>Dosen</h1>
          <Stack>
            <TableContainer className='border-list-admin'>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
              <button
                style={{ width: '190px', height: '40px', background: '#3F72AF', borderRadius: '40px', color: 'white', fontWeight: 500 }}
                onClick={handleOpenAddModal}
              >
                add dosen
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
        <DialogTitle>Delete dosen</DialogTitle>
        <DialogContent>
          <Typography>To confirm deletion, please enter: "delete-{dosenToDelete.nama}"</Typography>
          <TextField fullWidth label="Confirmation Text" value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 500 }}>
          <Typography variant="h6">Add Dosen
          <IconButton onClick={handleCloseAddModal} style={{float:'right'}}><CloseIcon color='primary'></CloseIcon></IconButton>
          </Typography>
          <form onSubmit={handleAddDosen}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Nip" name="nip" value={dosenData.nip} onChange={handleChange} inputRef={nipRef} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Nama" name="nama" value={dosenData.nama} onChange={handleChange} inputRef={namaRef} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Bidang" name="bidang" value={dosenData.bidang} onChange={handleChange} inputRef={bidangRef} required />
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

export default Dosen;
