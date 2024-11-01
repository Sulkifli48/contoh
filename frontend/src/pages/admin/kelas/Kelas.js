import React, { useState, useRef } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";
// import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Modal, TextField, Button, Grid, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete } from '@mui/material';
import {  
  MRT_GlobalFilterTextField as MRT_GLOBAL_FILTER_TEXT_FIELD,
  MRT_TablePagination as MRT_TABLE_BODY_CELL_VALUE, 
  MRT_TableBodyCellValue as MRT_TABLE_PAGINATION,
  // MRT_ToolbarAlertBanner, 
  flexRender, 
  useMaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { initialMatakuliahs } from '../../../assets/mockdata/dataMatkul';
import { initialDosen } from '../../../assets/mockdata/dataDosen';

const AddKelas = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [matakuliahToDelete, setMatakuliahToDelete] = useState({ id: '', kodeMatakul: '' });
  const [confirmationText, setConfirmationText] = useState('');
//   const [Matakuliahs, setMatakuliahs] = useState(initialMatakuliahs);

  const [matakuliahData, setMatakuliahData] = useState({
    matakuliah: '',
    kelas: '',
    dosen: '',
    kapasitas: '',
    jenjang: '',
  });

  // const matakuliahRef = useRef();
  const kelasRef = useRef();
  // const dosenRef = useRef();
  const kapasitasRef = useRef();
  const jenjangRef = useRef();
  // const buttonRef = useRef(null);
  const [matakuliahs, setMatakuliahs] = useState([]);

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
    setMatakuliahData({ ...matakuliahData, [name]: value });
  };

  // const handleKeyDown = (e, nextRef) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     nextRef.current.focus();
  //   }
  // };

  const handleAddKelas = (e) => {
    e.preventDefault();
    setMatakuliahs([...matakuliahs, { ...matakuliahData, createdAt: Date.now() }]);
    setMatakuliahData({
      matakuliah: '',
      kelas: '',
      dosen: '',
      kapasitas: '',
      jenjang: '',
    });
    setIsAddModalOpen(false);
  };

  const handleDeleteMatakuliah = (matakuliahId, kode) => {
    setMatakuliahToDelete({ id: matakuliahId, kode });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setMatakuliahs(matakuliahs.filter(matakuliah => matakuliah.id !== matakuliahToDelete.id));
    setIsDeleteDialogOpen(false);
  };

  const columns = [
    { accessorKey: 'matakuliah', header: 'Matakuliah' },
    { accessorKey: 'kelas', header: 'Kelas' },
    { accessorKey: 'dosen', header: 'Dosen' },
    { accessorKey: 'kapasitas', header: 'Kapasitas' },
    { accessorKey: 'jenjang', header: 'Jenjang' },
    {
      accessorKey: "action",
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <MdDelete color='red' size={20} onClick={() => handleDeleteMatakuliah(row.original.id, row.original.kode)} />
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
          <h1>Daftar Kelas</h1>
          <Stack>
            <TableContainer className='border-list-matakuliah'>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
              <button
                style={{ width: '190px', height: '40px', background: '#3F72AF', borderRadius: '40px', color: 'white', fontWeight: 500 }}
                onClick={handleOpenAddModal}
              >
                add kelas
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
        <DialogContent>
          <Typography>To confirm deletion, please enter: "delete-{matakuliahToDelete.kode}"</Typography>
          <TextField fullWidth label="Confirmation Text" value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 500 }}>
          <Typography variant="h6">Add Kelas
          <IconButton onClick={handleCloseAddModal} style={{float:'right'}}><CloseIcon color='primary'></CloseIcon></IconButton>
          </Typography>
          <form onSubmit={handleAddKelas}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={initialMatakuliahs.map((matkul) => matkul.matakuliah)}
                  renderInput={(params) => (
                    <TextField {...params} label="Matakuliah" name="matakuliah" required />
                  )}
                  value={matakuliahData.matakuliah}
                  onChange={(event, newValue) => {
                    setMatakuliahData({ ...matakuliahData, matakuliah: newValue });
                  }}
                  freeSolo
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Kelas" name="kelas" value={matakuliahData.kelas} onChange={handleChange} inputRef={kelasRef} required />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  options={initialDosen.map((dosen) => dosen.nama)}
                  renderInput={(params) => (
                    <TextField {...params} label="Dosen" name="dosen" required />
                  )}
                  value={matakuliahData.dosen}
                  onChange={(event, newValue) => {
                    setMatakuliahData({ ...matakuliahData, dosen: newValue });
                  }}
                  freeSolo
                />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Kapasitas" name="kapasitas" value={matakuliahData.kapasitas} onChange={handleChange} inputRef={kapasitasRef} required />
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth 
                  label="Jenjang" 
                  name="jenjang" 
                  value={matakuliahData.wp} 
                  onChange={handleChange} 
                  inputRef={jenjangRef} 
                required>
                  <MenuItem value="sarjana">S1</MenuItem>
                  <MenuItem value="magister">Magister</MenuItem>
                  <MenuItem value="inter">Internasional</MenuItem>
                </TextField>
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

export default AddKelas;
