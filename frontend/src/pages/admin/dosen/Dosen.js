import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import { MdDelete, MdEdit } from "react-icons/md";
import { 
  Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, 
  Modal, TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions,  IconButton 
} from '@mui/material';
import { 
  MRT_GlobalFilterTextField as MRT_GLOBAL_FILTER_TEXT_FIELD, 
  MRT_TableBodyCellValue as MRT_TABLE_BODY_CELL_VALUE, 
  MRT_TablePagination as MRT_TABLE_PAGINATION, 
  flexRender, 
  useMaterialReactTable 
} from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import "./Style.css";

const Dosen = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dosenToDelete, setDosenToDelete] = useState({ id_dosen: '', dosen: '' });
  const [confirmationText, setConfirmationText] = useState('');
  const [isDosenUsed, setIsDosenUsed] = useState(false);
  const [dosenData, setDosenData] = useState({ nip: '', dosen: '' });
  const [dosens, setDosens] = useState([]);

  const fetchDosens = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/listdosen');
      let data = await response.json();
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
        setDosenData({ nip: '', dosen: '' });
        setIsAddModalOpen(false);
      } else {
        console.error('Failed to add matakuliah');
      }
    } catch (error) {
      console.error("Error adding matakuliah: ", error);
    }
  };

  const handleOpenAddModal = () => {
    setDosenData({ nip: '', dosen: '' });
    setIsAddModalOpen(true);
  };
  
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleOpenEditModal = (dosen) => {
    setDosenData(dosen);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleEditDosen = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/dosenedit/${dosenData.id_dosen}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dosenData),
      });
      if (response.ok) {
        await fetchDosens();
        setIsEditModalOpen(false);
      } else {
        console.error('Failed to edit dosen');
      }
    } catch (error) {
      console.error("Error editing dosen: ", error);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setIsDosenUsed(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDosenData({ ...dosenData, [name]: value });
  };

  const checkDosenUsage = async (id_dosen) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/checkDosenUsage/${id_dosen}`);
      return await response.json();
    } catch (error) {
      console.error("Error checking dosen usage: ", error);
      return { is_used_in_kelas: false, is_used_in_jadwal: false };
    }
  };

  const handleDeleteDosen = async (id_dosen, dosen) => {
    const usageStatus = await checkDosenUsage(id_dosen);
    setDosenToDelete({ id_dosen, dosen });
    setIsDosenUsed(usageStatus.is_used_in_kelas && usageStatus.is_used_in_jadwal);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmationText === 'delete' && !isDosenUsed) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/dosendelete/${dosenToDelete.id_dosen}`, { method: 'DELETE' });
        if (response.ok) {
          setDosens(dosens.filter(dosen => dosen.id_dosen !== dosenToDelete.id_dosen));
          setIsDeleteDialogOpen(false);
          setConfirmationText('');
        } else {
          console.error('Failed to delete dosen');
        }
      } catch (error) {
        console.error("Error deleting dosen: ", error);
      }
    }
  };

  const columns = [
    { accessorKey: 'nip', header: 'Nip' },
    { accessorKey: 'dosen', header: 'Nama' },
    {
      accessorKey: "action",
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <MdEdit color='blue' size={20} onClick={() => handleOpenEditModal(row.original)} />
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
                  {dosens.length > 0 ? (
                    table.getRowModel().rows.map(row => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <TableCell align="center" key={cell.id}>
                            <MRT_TABLE_BODY_CELL_VALUE cell={cell} table={table} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        <Typography>No Data Available</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <MRT_TABLE_PAGINATION table={table} />
          </Stack>
        </div>

        <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete dosen</DialogTitle>
          <DialogContent sx={{ minWidth: 400 }}>
            {!isDosenUsed && (
              <Typography className='dialog-delete'>
                Apakah Anda ingin menghapus "{dosenToDelete.dosen}"?
              </Typography>
            )}
            {isDosenUsed && (
              <Typography className='dialog-delete'>
                Dosen "{dosenToDelete.dosen}" tidak dapat dihapus karena masih digunakan di kelas dan jadwal.
              </Typography>
            )}
            {!isDosenUsed && (
              <TextField
                label="Ketik 'delete' untuk konfirmasi"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                fullWidth
                margin="normal"
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Batal</Button>
            {!isDosenUsed && (
              <Button onClick={handleConfirmDelete} color="error" disabled={confirmationText !== 'delete'}>
                Delete
              </Button>
            )}
          </DialogActions>
        </Dialog>

        <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
          <Box sx={modalBoxStyles}>
            <IconButton onClick={handleCloseAddModal} sx={closeIconStyles}>
              <CloseIcon />
            </IconButton>
            <form onSubmit={handleAddDosen}>
              <Grid container spacing={2}>
                <Grid item xs={12}><Typography variant="h6" gutterBottom>Tambah dosen</Typography></Grid>
                <Grid item xs={12}><TextField label="Nip" name="nip" value={dosenData.nip} onChange={handleChange} required fullWidth /></Grid>
                <Grid item xs={12}><TextField label="Nama dosen" name="dosen" value={dosenData.dosen} onChange={handleChange} required fullWidth /></Grid>
                <Grid item xs={12}><Button fullWidth type="submit" variant="contained" color="primary">Tambah dosen</Button></Grid>
              </Grid>
            </form>
          </Box>
        </Modal>

        <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
          <Box sx={modalBoxStyles}>
            <IconButton onClick={handleCloseEditModal} sx={closeIconStyles}>
              <CloseIcon />
            </IconButton>
            <form onSubmit={handleEditDosen}>
              <Grid container spacing={2}>
                <Grid item xs={12}><Typography variant="h6" gutterBottom>Edit dosen</Typography></Grid>
                <Grid item xs={12}><TextField label="Nip" name="nip" value={dosenData.nip} onChange={handleChange} required fullWidth /></Grid>
                <Grid item xs={12}><TextField label="Nama dosen" name="dosen" value={dosenData.dosen} onChange={handleChange} required fullWidth /></Grid>
                <Grid item xs={12}><Button fullWidth type="submit" variant="contained" color="primary">Edit dosen</Button></Grid>
              </Grid>
            </form>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Dosen;

const modalBoxStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const closeIconStyles = {
  position: 'absolute',
  top: 8,
  right: 8,
};
