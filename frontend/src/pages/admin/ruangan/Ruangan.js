import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";
import { MdDelete, MdEdit } from "react-icons/md";
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Modal, TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete } from '@mui/material';
import {  
  MRT_GlobalFilterTextField as MRT_GLOBAL_FILTER_TEXT_FIELD,
  MRT_TableBodyCellValue as MRT_TABLE_BODY_CELL_VALUE, 
  MRT_TablePagination as MRT_TABLE_PAGINATION,
  flexRender, 
  useMaterialReactTable 
} from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

const Ruangan = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ruanganToDelete, setRuanganToDelete] = useState({ id_ruangan: '', name: '' });
  const [confirmationText, setConfirmationText] = useState('');
  const [ruanganData, setRuanganData] = useState({
    name: '',
    kapasitas: '',
    jenis: [],
  });
  const [ruanganEditData, setRuanganEditData] = useState({
    name: '',
    kapasitas: '',
    jenis: [],
  });


  const [ruangans, setRuangans] = useState([]);
  const [jenisData, setJenisData] = useState([]);
  const [jenisError, setJenisError] = useState(false);

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };
  const handleOpenAddModal = () => {
    setRuanganData({ name: '', kapasitas: '', jenis:[] });
    setIsAddModalOpen(true);
  };
  
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleOpenEditModal = (ruangan) => {
    console.log("Jenis sebelum format:", ruangan.jenis);
    
    const jenisFormatted = typeof ruangan.jenis === 'string' 
      ? ruangan.jenis.split(',').map((item) => item.trim()) 
      : ruangan.jenis.map((item) => item.trim());
  
    const idKelasFormatted = jenisFormatted.map((jenis) => {
      const matchedJenis = jenisData.find((data) => data.jenis === jenis);
      return matchedJenis ? matchedJenis.id_jenis : null; 
    }).filter((id) => id !== null); 
  
    console.log("ID Kelas setelah format:", idKelasFormatted);
  
    setRuanganEditData({
      id_ruangan: ruangan.id_ruangan,
      name: ruangan.name,
      kapasitas: ruangan.kapasitas,
      jenis: idKelasFormatted,
    });
    setIsEditModalOpen(true);
  };
  
  

  const handleCloseEditModal = () => setIsEditModalOpen(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setRuanganData({ ...ruanganData, [name]: value });
  };

  const handleEditRuangan = async (e) => {
    e.preventDefault();
    if (ruanganEditData.jenis.length === 0) {
      setJenisError(true);
      return;
    }
    setJenisError(false); 
    try {

      const payload = {
        id_ruangan: ruanganEditData.id_ruangan,
        name: ruanganEditData.name,
        kapasitas: ruanganEditData.kapasitas,
        jenis_ids: ruanganEditData.jenis,
    };
    console.log("ID Kelas setelah format:", payload);
  
      const response = await fetch(`http://127.0.0.1:5000/api/ruanganedit/${ruanganEditData.id_ruangan}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        await fetchRuangan();
        setIsEditModalOpen(false);
      } else {
        console.error('Failed to edit dosen');
      }
    } catch (error) {
      console.error("Error editing dosen: ", error);
    }
  };

  const fetchRuangan = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/listruangan');
      let data = await response.json();
      console.log(data);
      
      data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setRuangans(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchRuangan();
  }, []);

  const fetchData = async (endpoint, setState) => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setState(data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };
  
  useEffect(() => {
    fetchData('http://127.0.0.1:5000/api/listjenis', setJenisData);
  }, []);

const handleAddRuangan = async (e) => { 
  e.preventDefault();
  if (ruanganData.jenis.length === 0) {
    setJenisError(true);
    return;
  }
  setJenisError(false);
  try {
      const payload = {
          name: ruanganData.name,
          kapasitas: ruanganData.kapasitas,
          jenis_ids: ruanganData.jenis, 
      };

      const response = await fetch('http://127.0.0.1:5000/api/ruanganadd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
      });

      if (response.ok) {
          await fetchRuangan();
          setRuanganData({ name: '', kapasitas: '', jenis: [] });
          setIsAddModalOpen(false);
      } else {
          console.error('Failed to add ruangan');
      }
  } catch (error) {
      console.error('Error adding ruangan: ', error);
  }
};
  

  const handleDeleteRuangan = (id_ruangan, name) => {
    setRuanganToDelete({ id_ruangan, name });
    setIsDeleteDialogOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (confirmationText === `delete`) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/ruangandelete/${ruanganToDelete.id_ruangan}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          setRuangans(ruangans.filter(ruangan => ruangan.id_ruangan !== ruanganToDelete.id_ruangan));
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
    { accessorKey: 'name', header: 'Nama Ruangan' },
    { accessorKey: 'kapasitas', header: 'Kapasitas' },
    {
      accessorKey: "action",
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <MdEdit color='blue' size={20} onClick={() => handleOpenEditModal(row.original)} />
          <MdDelete color='red' size={20} onClick={() => handleDeleteRuangan(row.original.id_ruangan, row.original.name)} />
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
          <DialogContent sx={{ minWidth: 400 }}>
            <Typography className='dialog-delete'>apakah anda ingin menghapus "{ruanganToDelete.name}"?</Typography>
            <TextField fullWidth label="Entar `delete` to Confirm" value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} />
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
                  <TextField fullWidth label="Nama Ruangan" name="name" value={ruanganData.name} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Kapasitas" name="kapasitas" type="number" value={ruanganData.kapasitas} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                <Autocomplete
                      multiple
                      options={jenisData}
                      getOptionLabel={(option) => option.jenis} 
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Jenis"
                          error={jenisError}
                          helperText={jenisError ? "Silakan pilih maksimal 3 jenis" : ""}
                        />
                      )}
                      value={jenisData.filter((jenis) => ruanganData.jenis.includes(jenis.id_jenis))}
                      onChange={(event, newValue) => {
                        if (newValue.length <= 3) {
                          setRuanganData({
                            ...ruanganData,
                            jenis: newValue.map((jenis) => jenis.id_jenis),
                          });
                          setJenisError(false);
                        } else {
                          setJenisError(true);
                        }
                      }}
                      onBlur={() => {
                        setJenisError(ruanganData.jenis.length === 0 || ruanganData.jenis.length > 3);
                      }}
                      disableCloseOnSelect
                    />

                </Grid>
                
              </Grid>
              <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Add</Button>
            </form>
          </Box>
        </Modal>

        <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 500 }}>
            <Typography variant="h6">Edit Ruangan
              <IconButton onClick={handleCloseEditModal} style={{ float: 'right' }}><CloseIcon color='primary' /></IconButton>
            </Typography>
            <form onSubmit={handleEditRuangan}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Nama Ruangan" 
                    name="name" 
                    value={ruanganEditData.name} 
                    onChange={(e) => setRuanganEditData({ ...ruanganEditData, name: e.target.value })} 
                    required 
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Kapasitas" 
                    name="kapasitas" 
                    type="number" 
                    value={ruanganEditData.kapasitas} 
                    onChange={(e) => setRuanganEditData({ ...ruanganEditData, kapasitas: e.target.value })} 
                    required 
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={jenisData}
                    getOptionLabel={(option) => option.jenis} 
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Jenis"
                        error={jenisError}
                        helperText={jenisError ? "Silakan pilih maksimal 3 jenis" : ""}
                      />
                    )}
                    value={jenisData.filter((jenis) => ruanganEditData.jenis.includes(jenis.id_jenis))}
                    onChange={(event, newValue) => {
                      if (newValue.length <= 3) {
                        setRuanganEditData({
                          ...ruanganEditData,
                          jenis: newValue.map((jenis) => jenis.id_jenis),
                        });
                        setJenisError(false);
                      } else {
                        setJenisError(true);
                      }
                    }}
                    onBlur={() => {
                      setJenisError(ruanganEditData.jenis.length === 0 || ruanganEditData.jenis.length > 3);
                    }}
                    disableCloseOnSelect
                  />
                </Grid>
              </Grid>
              <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Save Changes</Button>
            </form>
          </Box>
        </Modal>

      </div>
    </div>
  );
};

export default Ruangan;
