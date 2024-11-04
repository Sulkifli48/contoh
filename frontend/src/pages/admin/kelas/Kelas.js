import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";
// import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { 
  Box, 
  Stack, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  Modal, 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Autocomplete, 
  FormHelperText  
} from '@mui/material';
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

const AddKelas = () => {
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedJenjang, setSelectedJenjang] = useState('All');
  const [skalaWarning, setSkalaWarning] = useState(''); 

  const [matakuliahs, setMatakuliahs] = useState([]);

  const [dosenError, setDosenError] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [matakuliahToDelete, setMatakuliahToDelete] = useState({ id: '', kelas: '' });
  const [confirmationText, setConfirmationText] = useState('');
  const [matakuliahData, setMatakuliahData] = useState({
    matakuliah: '',
    kelas: '',
    dosen: [],
    kapasitas: '',
    skala: '',
  });

  const kelasRef = useRef();
  const kapasitasRef = useRef();
  const skalaRef = useRef();

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSkalaWarning('');
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatakuliahData({ ...matakuliahData, [name]: value });
  };

  const handleAddKelas = (e) => {
    e.preventDefault();
    if (matakuliahData.dosen.length === 0) {
      setDosenError(true); 
      return; 
    }
    setDosenError(false);
  
    // Ambil nama mata kuliah tanpa kode
    const namaMatkul = matakuliahData.matakuliah.split(' - ')[1] || matakuliahData.matakuliah;
  
    setMatakuliahs([ 
      { ...matakuliahData, matakuliah: namaMatkul, createdAt: Date.now() }, // Hanya simpan nama mata kuliah
      ...matakuliahs 
    ]);
  
    setMatakuliahData({
      matakuliah: '',
      kelas: '',
      dosen: [],
      kapasitas: '',
      skala: '',
    });
    setIsAddModalOpen(false);
  };
  

  const handleDeleteMatakuliah = (matakuliahId, kelas) => {
    setMatakuliahToDelete({ id: matakuliahId, kelas });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setMatakuliahs(matakuliahs.filter(matakuliah => matakuliah.id !== matakuliahToDelete.id));
    setIsDeleteDialogOpen(false);
  };

  useEffect(() => {
    if (matakuliahData.matakuliah && matakuliahData.skala) {
      let newKelas = '';
      const namaMatkul = matakuliahData.matakuliah.split(' - ')[1] || matakuliahData.matakuliah;
      const existingClasses = matakuliahs
        .filter(item => item.matakuliah === namaMatkul)
        .map(item => item.kelas);
  
      setSkalaWarning('');
  
      if (matakuliahData.skala === 'Nasional') {
        let kelasLetter = 'A';
        while (existingClasses.includes(`${namaMatkul}. ${kelasLetter}`)) {
          kelasLetter = String.fromCharCode(kelasLetter.charCodeAt(0) + 1);
        }
        newKelas = `${namaMatkul}. ${kelasLetter}`;
      } else if (matakuliahData.skala === 'Inter') {
        if (!existingClasses.includes(`${namaMatkul}. inter`)) {
          newKelas = `${namaMatkul}. inter`;
        } else {
          setSkalaWarning('Hanya bisa ada satu kelas "Inter" untuk mata kuliah ini.');
        }
      } else if (matakuliahData.skala === 'MBKM') {
        if (!existingClasses.includes(`${namaMatkul}. MBKM`)) {
          newKelas = `${namaMatkul}. MBKM`;
        } else {
          setSkalaWarning('Hanya bisa ada satu kelas "MBKM" untuk mata kuliah ini.');
        }
      }
  
      // Update hanya `kelas` tanpa mengubah `matakuliah`
      setMatakuliahData(prevData => ({
        ...prevData,
        kelas: newKelas || ''
      }));
    } else {
      setMatakuliahData(prevData => ({
        ...prevData,
        kelas: '',
      }));
    }
  }, [matakuliahData.matakuliah, matakuliahData.skala, matakuliahs]);
  

  const columns = [
    { accessorKey: 'matakuliah', header: 'Matakuliah' },
    { accessorKey: 'kelas', header: 'Kelas', enableSorting: true },
    {
      accessorKey: 'dosen',
      header: 'Dosen',
      Cell: ({ row }) => (
        <ul style={{ padding: 0, listStyleType: 'none', margin: 0 }}>
          {row.original.dosen.map((dosen, index) => (
            <li key={index}>{dosen}</li>
          ))}
        </ul>
      ),
    },
    { accessorKey: 'kapasitas', header: 'Kapasitas' },
    {
      accessorKey: "action",
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <MdDelete color='red' size={20} onClick={() => handleDeleteMatakuliah(row.original.id, row.original.kelas)} />
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
      sorting: [{ id: 'kelas', desc: false }]
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
                  Tambah Kelas
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
        <DialogTitle>Delete Matakuliah</DialogTitle>
        <DialogContent>
          <Typography>To confirm deletion, please enter: "Delete"</Typography>
          <TextField fullWidth label="Confirmation Text" value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} disabled={confirmationText !== 'Delete'}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 500 }}>
            <Typography variant="h6">Tambah Kelas
              <IconButton onClick={handleCloseAddModal} style={{ float: 'right' }}><CloseIcon color='primary'></CloseIcon></IconButton>
            </Typography>
            <form onSubmit={handleAddKelas}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField select fullWidth 
                    label="Jenjang" 
                    value={selectedJenjang} 
                    onChange={(e) => setSelectedJenjang(e.target.value)} 
                    required
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="S1">S1</MenuItem>
                    <MenuItem value="S2">S2</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField select fullWidth 
                    label="Semester" 
                    value={selectedSemester} 
                    onChange={(e) => setSelectedSemester(e.target.value)} 
                    required>
                    <MenuItem value="All">All</MenuItem> {/* Opsi All */}
                    <MenuItem value="Ganjil">Ganjil</MenuItem>
                    <MenuItem value="Genap">Genap</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                <Autocomplete
                options={initialMatakuliahs
                  .filter(matkul => 
                    (selectedJenjang === 'All' || matkul.jenjang === selectedJenjang) && 
                    (selectedSemester === 'All' || matkul.semester === selectedSemester || matkul.semester === 'All')
                  )
                  .map((matkul) => `${matkul.kode} - ${matkul.matakuliah}`)} // Format yang diinginkan
                renderInput={(params) => (
                  <TextField {...params} label="Matakuliah" name="matakuliah" required />
                )}
                value={matakuliahData.matakuliah}
                onChange={(event, newValue) => {
                  setMatakuliahData({ ...matakuliahData, matakuliah: newValue || '' });
                }}
                freeSolo
              />


                </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth 
                  label="Skala" 
                  name="skala" 
                  value={matakuliahData.skala} 
                  onChange={handleChange} 
                  inputRef={skalaRef} 
                  error={!!skalaWarning} 
                  helperText={skalaWarning} 
                required>
                  <MenuItem value="Nasional">Nasional</MenuItem>
                  <MenuItem value="Inter">Internasional</MenuItem>
                  <MenuItem value="MBKM">MBKM</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth 
                  label="Kelas" 
                  name="kelas" 
                  value={matakuliahData.kelas} 
                  onChange={handleChange} 
                  inputRef={kelasRef} 
                  disabled={!!skalaWarning}
                  required 
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={initialDosen.map((dosen) => dosen.nama)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Dosen" 
                      name="dosen" 
                      error={dosenError} 
                      helperText={matakuliahData.dosen.length >= 3 ? "Batas maksimum 3 dosen." : ""}
                      inputProps={{
                        ...params.inputProps,
                        disabled: matakuliahData.dosen.length >= 3 // Nonaktifkan input jika sudah ada 3 dosen
                      }}
                    />
                  )}
                  value={matakuliahData.dosen}
                  onChange={(event, newValue) => {
                    if (newValue.length <= 3) { // Cek panjang array
                      setMatakuliahData({ ...matakuliahData, dosen: newValue });
                      setDosenError(false); // Reset error jika ada input di dosen
                    }
                  }}
                  freeSolo
                />
                {dosenError && (
                  <FormHelperText error>
                    Silakan pilih setidaknya satu dosen.
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Kapasitas" name="kapasitas" value={matakuliahData.kapasitas} onChange={handleChange} inputRef={kapasitasRef} required />
              </Grid>
            </Grid>
            <Button fullWidth type="submit" variant="contained" color="primary" disabled={!!skalaWarning} sx={{ mt: 2 }}>Tambah</Button>
          </form>
        </Box>
      </Modal>
      </div>
    </div>
  );
};

export default AddKelas;

