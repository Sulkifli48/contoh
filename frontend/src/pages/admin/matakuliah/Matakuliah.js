import React, { useState, 
  // useRef,
   useEffect } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";
import { MdDelete, MdEdit } from "react-icons/md";
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Modal, TextField, Button, Grid, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { MRT_GlobalFilterTextField as MRT_GLOBAL_FILTER_TEXT_FIELD, MRT_TablePagination as MRT_TABLE_BODY_CELL_VALUE, MRT_TableBodyCellValue as MRT_TABLE_PAGINATION, flexRender, useMaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';


const AddMatakuliah = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [matakuliahToDelete, setMatakuliahToDelete] = useState({ id_matkul: '', matakuliah: '' });
  const [confirmationText, setConfirmationText] = useState('');
  const [isMatkulUsed, setIsMatkulUsed] = useState(false);

  const [matakuliahs, setMatakuliahs] = useState([]);
  const [matakuliahData, setMatakuliahData] = useState({
    kode: '',
    matakuliah: '',
    sks: '',
    wp: '',
    semester: '',
    jenjang: '',
  });

  const fetchMatakuliahs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/listmatakuliah');
      let data = await response.json();
      console.log(data);
      
      data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setMatakuliahs(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchMatakuliahs();
  }, []);

  
  const handleOpenAddModal = () => {
    setMatakuliahData({ kode: '', matakuliah: '', sks: '', wp: '', semester: '', jenjang: '', });
    setIsAddModalOpen(true);
  };


  const handleOpenEditModal = (matakuliah) => {
    setMatakuliahData(matakuliah);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatakuliahData(prevData => ({
      ...prevData,
      [name]: value,
      ...(name === "wp" && value === "P" ? { semester: "All" } : {})
    }));
  };
  

  const handleEditMatakuliah = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/matakuliahedit/${matakuliahData.id_matkul}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matakuliahData),
      });
      if (response.ok) {
        await fetchMatakuliahs();
        setIsEditModalOpen(false);
      } else {
        console.error('Failed to edit dosen');
      }
    } catch (error) {
      console.error("Error editing dosen: ", error);
    }
  };

  const handleAddMatakuliah = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/matakuliahadd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matakuliahData),
      });
  
      if (response.ok) {
        await fetchMatakuliahs();
        setMatakuliahData({ kode: '', matakuliah: '', sks: '', wp: '', semester: '', jenjang: '' });
        setIsAddModalOpen(false);
      } else {
        console.error('Failed to add matakuliah');
      }
    } catch (error) {
      console.error("Error adding matakuliah: ", error);
    }
  };
  
  const checkMatkulUsage = async (id_matkul) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/checkMatkulUsage/${id_matkul}`);
      return await response.json();
    } catch (error) {
      console.error("Error checking matkul usage: ", error);
      return { is_used_in_kelas: false, is_used_in_jadwal: false };
    }
  };

  const handleDeleteMatakuliah = async (id_matkul, matakuliah) => {
    const usageStatus = await checkMatkulUsage(id_matkul);
    setMatakuliahToDelete({ id_matkul, matakuliah });
    setIsMatkulUsed(usageStatus.is_used_in_kelas && usageStatus.is_used_in_jadwal);
    setIsDeleteDialogOpen(true);
  };
  

  const handleConfirmDelete = async () => {
    if (confirmationText === `delete` && !isMatkulUsed) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/matakuliah/${matakuliahToDelete.id_matkul}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMatakuliahs(matakuliahs.filter(matakuliah => matakuliah.id_matkul !== matakuliahToDelete.id_matkul));
          setIsDeleteDialogOpen(false);
          setConfirmationText('');
        } else {
          console.error('Failed to delete matakuliah');
        }
      } catch (error) {
        console.error("Error deleting matakuliah: ", error);
      }
    } else {
      alert("Confirmation text does not match.");
    }
  };

  

  const columns = [
    { accessorKey: 'kode', header: 'Kode' },
    { accessorKey: 'matakuliah', header: 'Matakuliah' },
    { accessorKey: 'sks', header: 'SKS' },
    { accessorKey: 'jenjang', header: 'Jenjang' },
    { accessorKey: 'wp', header: 'W/P' },
    { accessorKey: 'semester', header: 'Semester' },
    {
      accessorKey: "action",
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <MdEdit color='blue' size={20} onClick={() => handleOpenEditModal(row.original)} />
          <MdDelete color='red' size={20} onClick={() => handleDeleteMatakuliah(row.original.id_matkul, row.original.matakuliah)} />
        </div>
      ),
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: matakuliahs,
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
          <h1>Daftar Matakuliah</h1>
          <Stack>
            <TableContainer className='border-list-matakuliah'>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
              <button
                style={{ width: '190px', height: '40px', background: '#3F72AF', borderRadius: '40px', color: 'white', fontWeight: 500 }}
                onClick={handleOpenAddModal}
              >
                add matakuliah
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
                        <MRT_TABLE_PAGINATION cell={cell} table={table} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>
            <MRT_TABLE_BODY_CELL_VALUE table={table} />
          </Stack>
        </div>


      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Matakuliah</DialogTitle>
          <DialogContent sx={{ minWidth: 400 }}>
            {!isMatkulUsed && (
              <Typography className='dialog-delete'>
                Apakah Anda ingin menghapus "{matakuliahToDelete.matakuliah}"?
              </Typography>
            )}
            {isMatkulUsed && (
              <Typography className='dialog-delete'>
                matakuliah "{matakuliahToDelete.matakuliah}" tidak dapat dihapus karena masih digunakan di kelas dan jadwal.
              </Typography>
            )}
            {!isMatkulUsed && (
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
            {!isMatkulUsed && (
              <Button onClick={handleConfirmDelete} color="error" disabled={confirmationText !== 'delete'}>
                Delete
              </Button>
            )}
          </DialogActions>
        </Dialog>

      <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 500 }}>
          <Typography variant="h6">Add Matakuliah
          <IconButton onClick={handleCloseAddModal} style={{float:'right'}}><CloseIcon color='primary'></CloseIcon></IconButton>
          </Typography>
          <form onSubmit={handleAddMatakuliah}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Kode" name="kode" value={matakuliahData.kode} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Matakuliah" name="matakuliah" value={matakuliahData.matakuliah} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth label="SKS" name="sks" value={matakuliahData.sks} onChange={handleChange} required>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth label="Jenjang" name="jenjang" value={matakuliahData.jenjang} onChange={handleChange} required>
                  <MenuItem value="S1">Sarjana</MenuItem>
                  <MenuItem value="S2">Magister</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth label="W/P" name="wp" value={matakuliahData.wp} onChange={handleChange} required>
                  <MenuItem value="W">Wajib</MenuItem>
                  <MenuItem value="P">Pilihan</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth 
                  label="Semester" 
                  name="semester" 
                  value={matakuliahData.semester} 
                  onChange={handleChange} 
                  required
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="6">6</MenuItem>
                  <MenuItem value="7">7</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Add</Button>
          </form>
        </Box>
      </Modal>


      <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 500 }}>
          <Typography variant="h6">Edit Matakuliah
          <IconButton onClick={handleCloseEditModal} style={{float:'right'}}><CloseIcon color='primary'></CloseIcon></IconButton>
          </Typography>
          <form onSubmit={handleEditMatakuliah}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Kode" name="kode" value={matakuliahData.kode} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Matakuliah" name="matakuliah" value={matakuliahData.matakuliah} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth label="SKS" name="sks" value={matakuliahData.sks} onChange={handleChange} required>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth label="Jenjang" name="jenjang" value={matakuliahData.jenjang} onChange={handleChange} required>
                  <MenuItem value="S1">Sarjana</MenuItem>
                  <MenuItem value="S2">Magister</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth label="W/P" name="wp" value={matakuliahData.wp} onChange={handleChange} required>
                  <MenuItem value="W">Wajib</MenuItem>
                  <MenuItem value="P">Pilihan</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth 
                  label="Semester" 
                  name="semester" 
                  value={matakuliahData.semester} 
                  onChange={handleChange} 
                  required
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="6">6</MenuItem>
                  <MenuItem value="7">7</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Edit</Button>
          </form>
        </Box>
      </Modal>

      </div>
    </div>
  );
};

export default AddMatakuliah;
