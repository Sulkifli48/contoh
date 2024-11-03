import React, { useState} from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";
import { MdDelete } from "react-icons/md";
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
import { initialMatakuliahs } from '../../../assets/mockdata/dataMatkul';
import { initialDosen } from '../../../assets/mockdata/dataDosen';

const Jadwal = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jadwalToDelete, setJadwalToDelete] = useState({ id: '', namaMatkul: '' });
  const [confirmationText, setConfirmationText] = useState('');
  const [jadwalData, setJadwalData] = useState({
    waktu: '',
    kodeMatkul: '',
    namaMatkul: '',
    kelas: '',
    wp: '',
    namaDosen1: '',
    namaDosen2: '',
    kodeRuangan: '',
  });

  const [jadwals, setJadwals] = useState([]);

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
    setJadwalData({ ...jadwalData, [name]: value });
  };

  const handleAddJadwal = (e) => {
    e.preventDefault();
    setJadwals([{ ...jadwalData, id: Date.now() },...jadwals]);
    setJadwalData({
      waktu: '',
      kodeMatkul: '',
      namaMatkul: '',
      kelas: '',
      wp: '',
      namaDosen1: '',
      namaDosen2: '',
      kodeRuangan: '',
    });
    setIsAddModalOpen(false);
  };

  const handleDeleteJadwal = (jadwalId, nama) => {
    setJadwalToDelete({ id: jadwalId, nama });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setJadwals(jadwals.filter(jadwal => jadwal.id !== jadwalToDelete.id));
    setIsDeleteDialogOpen(false);
  };

  const columns = [
    { accessorKey: 'waktu', header: 'Waktu (Jam)' },
    { accessorKey: 'kodeMatkul', header: 'Kode Mata Kuliah' },
    { accessorKey: 'namaMatkul', header: 'Nama Mata Kuliah' },
    { accessorKey: 'kelas', header: 'Kelas' },
    { accessorKey: 'wp', header: 'W/P' },
    { accessorKey: 'namaDosen1', header: 'Nama Dosen 1' },
    { accessorKey: 'namaDosen2', header: 'Nama Dosen 2' },
    { accessorKey: 'kodeRuangan', header: 'Kode Ruangan' },
    {
      accessorKey: "action",
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <MdDelete color='red' size={20} onClick={() => handleDeleteJadwal(row.original.id, row.original.namaMatkul)} />
        </div>
      ),
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: jadwals,
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
          <h1>Daftar Jadwal</h1>
          <Stack>
          <TableContainer className='border-list-matakuliah'>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
                <button
                  style={{ width: '190px', height: '40px', background: '#3F72AF', borderRadius: '40px', color: 'white', fontWeight: 500 }}
                  onClick={handleOpenAddModal}
                >
                  Add Jadwal
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
          <DialogTitle>Delete Jadwal</DialogTitle>
          <DialogContent>
            <Typography>To confirm deletion, please enter: "delete-{jadwalToDelete.nama}"</Typography>
            <TextField fullWidth label="Confirmation Text" value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleConfirmDelete}>Delete</Button>
          </DialogActions>
        </Dialog>

        <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 500 }}>
            <Typography variant="h6">Add Jadwal
              <IconButton onClick={handleCloseAddModal} style={{ float: 'right' }}><CloseIcon color='primary' /></IconButton>
            </Typography>
            <form onSubmit={handleAddJadwal}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Waktu (Jam)" name="waktu" value={jadwalData.waktu} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                <Autocomplete
                  options={initialMatakuliahs.map((jadwal) => `${jadwal.kode} - ${jadwal.matakuliah}`)}
                  renderInput={(params) => (
                    <TextField {...params} label="Kode - Mata Kuliah" name="kodeMatkul" required />
                  )}
                  value={jadwalData.kodeMatkul ? `${jadwalData.kodeMatkul} - ${jadwalData.namaMatkul}` : ''}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      const [kode, mataKuliah] = newValue.split(' - ');
                      const selectedMatakuliah = initialMatakuliahs.find(matakuliah => matakuliah.kode === kode);
                      const wpValue = selectedMatakuliah ? selectedMatakuliah.wp : '';
                      setJadwalData({ 
                        ...jadwalData, 
                        kodeMatkul: kode, 
                        namaMatkul: mataKuliah,
                        wp: wpValue 
                      });
                    } else {
                      setJadwalData({ 
                        ...jadwalData, 
                        kodeMatkul: '', 
                        namaMatkul: '', 
                        wp: '' 
                      });
                    }
                  }}
                  freeSolo
                />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Kelas" name="kelas" value={jadwalData.kelas} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    options={initialDosen.map((dosen) => dosen.nama)}
                    renderInput={(params) => (
                      <TextField {...params} label="Nama Dosen 1" name="namaDosen1" required />
                    )}
                    value={jadwalData.namaDosen1}
                    onChange={(event, newValue) => {
                      setJadwalData({ ...jadwalData, namaDosen1: newValue });
                    }}
                    freeSolo
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    options={initialDosen.map((dosen) => dosen.nama)}
                    renderInput={(params) => (
                      <TextField {...params} label="Nama Dosen 2" name="namaDosen2" />
                    )}
                    value={jadwalData.namaDosen2}
                    onChange={(event, newValue) => {
                      setJadwalData({ ...jadwalData, namaDosen2: newValue });
                    }}
                    freeSolo
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Kode Ruangan" name="kodeRuangan" value={jadwalData.kodeRuangan} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>Add Jadwal</Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Jadwal;
