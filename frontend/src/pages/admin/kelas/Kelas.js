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
  FormHelperText,
  IconButton,
} from '@mui/material';
import {  
  MRT_GlobalFilterTextField as MRT_GLOBAL_FILTER_TEXT_FIELD, 
  MRT_TableBodyCellValue as MRT_TABLE_BODY_CELL_VALUE, 
  MRT_TablePagination as MRT_TABLE_PAGINATION, 
  flexRender, 
  useMaterialReactTable 
} from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';

const AddKelas = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [kelasToDelete, setKelasToDelete] = useState({ id: '', kelas: '' });
  const [confirmationText, setConfirmationText] = useState('');
  
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedJenjang, setSelectedJenjang] = useState('All');
  const [skalaWarning, setSkalaWarning] = useState('');
  
  const [matakuliahs, setMatakuliahs] = useState([]);
  const [matakuliahError, setMatakuliahError] = useState(false);
  const [matakuliahsData, setMatakuliahsData] = useState([]);
  
  const [dosenData, setDosenData] = useState([]);
  const [dosenError, setDosenError] = useState(false);


  const [kelasData, setKelasData] = useState([]);
  const [listKelasData, setListKelasData] = useState({
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
    setListKelasData({ ...listKelasData, [name]: value });
  };

  const handleAddKelas = (e) => {
    e.preventDefault();
  
    if (listKelasData.dosen.length === 0) {
      setDosenError(true);
      return; 
    }
    setDosenError(false);
  
    const selectedMatakuliah = matakuliahsData.find(
      matkul => `${matkul.kode} - ${matkul.matakuliah}` === listKelasData.matakuliah 
    );
  
    if (!selectedMatakuliah) {
      setMatakuliahError(true);
      return;
    }
    setMatakuliahError(false);
  
    // Ambil id_matkul dari mata kuliah yang dipilih
    const id_matkul = selectedMatakuliah ? selectedMatakuliah.id_matkul : null;
    const namaMatkul = selectedMatakuliah ? selectedMatakuliah.matakuliah : '';
  
    // Ambil id_dosen dari data dosen yang dipilih
    const selectedDosenIds = dosenData
      .filter(dosen => listKelasData.dosen.includes(dosen.dosen))
      .map(dosen => dosen.id_dosen);
  
    // Tambahkan console.log di sini untuk menampilkan semua data yang akan disimpan
    console.log("Data kelas yang ditambahkan:", {
      matakuliah: namaMatkul,
      id_matkul: id_matkul,
      kelas: listKelasData.kelas,
      dosen: listKelasData.dosen,
      id_dosen: selectedDosenIds,
      kapasitas: listKelasData.kapasitas,
      skala: listKelasData.skala,
      createdAt: Date.now()
    });
  
    setMatakuliahs([{ 
      ...listKelasData, 
      matakuliah: namaMatkul, 
      id_matkul: id_matkul, 
      id_dosen: selectedDosenIds,
      createdAt: Date.now() 
    }, ...matakuliahs]);
  
    // Reset data
    setListKelasData({
      matakuliah: '',
      kelas: '',
      dosen: [],
      kapasitas: '',
      skala: '',
    });
    setIsAddModalOpen(false);
  }  

  const handleDeleteMatakuliah = (matakuliahId, kelas) => {
    setKelasToDelete({ id: matakuliahId, kelas });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setMatakuliahs(matakuliahs.filter(matakuliah => matakuliah.id !== kelasToDelete.id));
    setIsDeleteDialogOpen(false);
  };

  useEffect(() => {
    // Fetch data for matakuliahs
    fetch('http://127.0.0.1:5000/api/matakuliah')
      .then(response => response.json())
      .then(data => setMatakuliahsData(data))
      .catch(error => console.error('Error fetching matakuliah data:', error));
  
    // Fetch data for dosen
    fetch('http://127.0.0.1:5000/api/dosen')
      .then(response => response.json())
      .then(data => setDosenData(data))
      .catch(error => console.error('Error fetching dosen data:', error));
  
    // Fetch data for kelas
    fetch('http://127.0.0.1:5000/api/kelas')
      .then(response => response.json())
      .then(data => setKelasData(data))
      .catch(error => console.error('Error fetching kelas data:', error));
  }, []);
  

  useEffect(() => {
    if (listKelasData.matakuliah && listKelasData.skala) {
      let newKelas = '';
      const namaMatkul = listKelasData.matakuliah.split(' - ')[1] || listKelasData.matakuliah;
      const existingClasses = matakuliahs
        .filter(item => item.matakuliah === namaMatkul)
        .map(item => item.kelas);
  
      setSkalaWarning('');
  
      if (listKelasData.skala === 'Nasional') {
        let kelasLetter = 'A';
        while (existingClasses.includes(`${namaMatkul}. ${kelasLetter}`)) {
          kelasLetter = String.fromCharCode(kelasLetter.charCodeAt(0) + 1);
        }
        newKelas = `${namaMatkul}. ${kelasLetter}`;
      } else if (listKelasData.skala === 'Inter') {
        if (!existingClasses.includes(`${namaMatkul}. inter`)) {
          newKelas = `${namaMatkul}. inter`;
        } else {
          setSkalaWarning('Hanya bisa ada satu kelas "Inter" untuk mata kuliah ini.');
        }
      } else if (listKelasData.skala === 'MBKM') {
        if (!existingClasses.includes(`${namaMatkul}. MBKM`)) {
          newKelas = `${namaMatkul}. MBKM`;
        } else {
          setSkalaWarning('Hanya bisa ada satu kelas "MBKM" untuk mata kuliah ini.');
        }
      }
  
      // Update hanya `kelas` tanpa mengubah `matakuliah`
      setListKelasData(prevData => ({
        ...prevData,
        kelas: newKelas || ''
      }));
    } else {
      setListKelasData(prevData => ({
        ...prevData,
        kelas: '',
      }));
    }
  }, [listKelasData.matakuliah, listKelasData.skala, matakuliahs]);
  

  const columns = [
    { accessorKey: 'matakuliah', header: 'Matakuliah' },
    { accessorKey: 'kelas', header: 'Kelas', enableSorting: true },
    {
      accessorKey: 'dosen',
      header: 'Dosen',
      Cell: ({ row }) => {
        const dosenData = row.original.dosen;
        return (
          <div>
            {dosenData}
          </div>
        );
      }
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
    data: kelasData,  // Gunakan kelasData untuk menampilkan kelas
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
                  options={matakuliahsData
                    .filter(matkul => 
                      (selectedJenjang === 'All' || matkul.jenjang === selectedJenjang) && 
                      (selectedSemester === 'All' || matkul.semester === selectedSemester || matkul.semester === 'All')
                    )
                    .map((matkul) => ({
                      label: `${matkul.kode} - ${matkul.matakuliah}`,
                      value: `${matkul.kode} - ${matkul.matakuliah}`,
                    }))}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Matakuliah" 
                      name="matakuliah"
                      error={matakuliahError} 
                      helperText={matakuliahError ? "Silakan pilih mata kuliah yang valid dari daftar." : ""} 
                      required 
                    />
                  )}
                  value={listKelasData.matakuliah}
                  onChange={(event, newValue) => {
                    setListKelasData({ ...listKelasData, matakuliah: newValue ? newValue.value : '' });
                    setMatakuliahError(false);
                  }}
                  onBlur={() => {
                    const matakuliahValid = matakuliahsData.some(matkul => 
                      `${matkul.kode} - ${matkul.matakuliah}` === listKelasData.matakuliah
                    );
                    setMatakuliahError(!matakuliahValid); 
                  }}
                  freeSolo
                />



                </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth 
                  label="Skala" 
                  name="skala" 
                  value={listKelasData.skala} 
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
                  value={listKelasData.kelas} 
                  onChange={handleChange} 
                  inputRef={kelasRef} 
                  disabled={!!skalaWarning}
                  required 
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={dosenData.map((dosen) => dosen.dosen)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Dosen" 
                      name="dosen" 
                      error={dosenError} 
                      helperText={listKelasData.dosen.length >= 3 ? "Batas maksimum 3 dosen." : ""}
                      inputProps={{
                        ...params.inputProps,
                        disabled: listKelasData.dosen.length >= 3 // Nonaktifkan input jika sudah ada 3 dosen
                      }}
                    />
                  )}
                  value={listKelasData.dosen}
                  onChange={(event, newValue) => {
                    if (newValue.length <= 3) { // Cek panjang array
                      setListKelasData({ ...listKelasData, dosen: newValue });
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
                <TextField fullWidth label="Kapasitas" name="kapasitas" value={listKelasData.kapasitas} onChange={handleChange} inputRef={kapasitasRef} required />
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

