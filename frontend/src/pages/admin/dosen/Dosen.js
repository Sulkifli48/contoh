import React, { useState, 
  // useRef, 
  useEffect } from 'react';
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

const Dosen = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dosenToDelete, setDosenToDelete] = useState({ id_dosen: '', dosen: '' });
  const [confirmationText, setConfirmationText] = useState('');

  const [dosenData, setDosenData] = useState({
    nip: '',
    dosen: '',
    bidang: '', 
  });

  const [dosens, setDosens] = useState([]);

  const fetchDosens = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/listdosen');
      let data = await response.json();
      console.log(data);
      
      data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setDosens(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

useEffect(() => {
  fetchDosens();
}, []);

const handleAddDosen = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://127.0.0.1:5000/api/dosenadd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dosenData),
    });

    if (response.ok) {
      await fetchDosens();
      setDosenData({ nip: '', dosen: '', bidang: ''});
      setIsAddModalOpen(false);
    } else {
      console.error('Failed to add matakuliah');
    }
  } catch (error) {
    console.error("Error adding matakuliah: ", error);
  }
};

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

  

  const handleDeleteDosen = (id_dosen, dosen) => {
    setDosenToDelete({ id_dosen, dosen });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmationText === `delete`) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/dosendelete/${dosenToDelete.id_dosen}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          setDosens(dosens.filter(dosen => dosen.id_dosen !== dosenToDelete.id_dosen));
          setIsDeleteDialogOpen(false);
          setConfirmationText('');
        } else {
          console.error('Failed to delete admin');
        }
      } catch (error) {
        console.error("Error deleting admin: ", error);
      }
    } else {
      alert("Confirmation text does not match.");
    }
  };
  

  const columns = [
    { accessorKey: 'nip', header: 'Nip' },
    { accessorKey: 'dosen', header: 'Nama' },
    { accessorKey: 'bidang', header: 'Bidang' }, 
    {
      accessorKey: "action",
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <MdDelete color='red' size={20} onClick={() => handleDeleteDosen(row.original.id_dosen, row.original.dosen)} />
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
        <DialogContent sx={{ minWidth: 400 }}>
          <Typography>{dosenToDelete.dosen}</Typography>
          <TextField fullWidth label="Enter `delete` to Confirm" value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} />
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
                <TextField fullWidth label="Nip" name="nip" value={dosenData.nip} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Nama" name="dosen" value={dosenData.name} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Bidang" name="bidang" value={dosenData.bidang} onChange={handleChange} required />
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
