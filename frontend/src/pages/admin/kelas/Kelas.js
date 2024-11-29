import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";
// import { FaEdit } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
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
  // FormHelperText,
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
  const [kelasToDelete, setKelasToDelete] = useState({ id_kelas: '', kelas: '' });
  const [confirmationText, setConfirmationText] = useState('');
  const [skalaWarning, setSkalaWarning] = useState('');
  
  // const [matakuliahs, setMatakuliahs] = useState([]);
  const [matakuliahError, setMatakuliahError] = useState(false);
  const [matakuliahsData, setMatakuliahsData] = useState([]);
  
  const [dosenData, setDosenData] = useState([]);
  const [dosenError, setDosenError] = useState(false);
  const [dosenErrors, setDosenErrors] = useState(false);

  const [kelasData, setKelasData] = useState([]);
  const [listKelasData, setListKelasData] = useState({
    matakuliah: '',
    kelas: '',
    dosen: [],
    kapasitas: '',
    skala: '',
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [kelasToEdit, setKelasToEdit] = useState({
    id_kelas: '',
    matakuliah: '',
    kelas: '',
    dosen: [],
    kapasitas: '',
    skala: '',
  });

  
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
    fetchData('http://127.0.0.1:5000/api/listmatakuliah', setMatakuliahsData);
    fetchData('http://127.0.0.1:5000/api/listdosen', setDosenData);
    fetchData('http://127.0.0.1:5000/api/listkelas', setKelasData);
  }, []);

  const handleEditKelas = (kelas) => {
    setKelasToEdit({
      id_kelas: kelas.id_kelas,
      matakuliah: `${kelas.matakuliah}`, 
      kelas: kelas.kelas,
      dosen: kelas.dosen.split('\n'),
      kapasitas: kelas.kapasitas,
      skala: kelas.skala,
    });
    setIsEditModalOpen(true);
  };
  
  const handleUpdateKelas = async (e) => {
    e.preventDefault();

    if (kelasToEdit.dosen.length === 0) {
      setDosenErrors(true);
      return;
    }
    setDosenErrors(false);

    try {
      // Ambil ID matakuliah dari nama
      const selectedMatakuliah = matakuliahsData.find(
        matkul => matkul.matakuliah === kelasToEdit.matakuliah
      );
      const id_matkul = selectedMatakuliah ? selectedMatakuliah.id_matkul : null;
      if (!id_matkul) {
        console.error('Matakuliah tidak ditemukan!');
        return;
      }

      const selectedDosenIds = dosenData
        .filter(dosen => kelasToEdit.dosen.includes(dosen.dosen))
        .sort((a, b) => kelasToEdit.dosen.indexOf(a.dosen) - kelasToEdit.dosen.indexOf(b.dosen)) 
        .map(dosen => dosen.id_dosen);

      const dataToSend = {
        matkul_id: id_matkul,
        skala: kelasToEdit.skala,
        kelas: kelasToEdit.kelas,
        dosen_ids: selectedDosenIds,
        kapasitas: kelasToEdit.kapasitas,
      };

      const response = await fetch(`http://127.0.0.1:5000/api/kelasedit/${kelasToEdit.id_kelas}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const updatedKelasData = await fetch('http://127.0.0.1:5000/api/listkelas')
          .then(res => res.json())
          .catch(err => console.error('Error fetching updated kelas:', err));

        setKelasData(updatedKelasData);
        setIsEditModalOpen(false);
      } else {
        console.error('Failed to update kelas');
      }
    } catch (error) {
      console.error('Error updating kelas:', error);
    }
  };
  
  
   
  const handleOpenAddModal = () => {
    setListKelasData({ 
      matakuliah: '',
      kelas: '',
      dosen: [],
      kapasitas: '',
      skala: '', });
    setIsAddModalOpen(true);
  };

  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSkalaWarning('');
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setListKelasData({ ...listKelasData, [name]: value });
  };

  const handleAddKelas = async (e) => {
  e.preventDefault();

  // Validasi input dosen
  if (listKelasData.dosen.length === 0) {
    setDosenError(true);
    return;
  }
  setDosenError(false);

  const selectedDosenIds = dosenData
  .filter(dosen => listKelasData.dosen.includes(dosen.dosen))
  .sort((a, b) => listKelasData.dosen.indexOf(a.dosen) - listKelasData.dosen.indexOf(b.dosen)) // Urutkan sesuai urutan dari backend
  .map(dosen => dosen.id_dosen);



  console.log("Selected Dosen IDs:", selectedDosenIds);
  console.log("List Kelas Data:", listKelasData);


  const selectedMatakuliah = matakuliahsData.find(
    matkul => `${matkul.kode} - ${matkul.matakuliah}` === listKelasData.matakuliah
  );

  if (!selectedMatakuliah) {
    setMatakuliahError(true);
    return;
  }
  setMatakuliahError(false);

  const id_matkul = selectedMatakuliah ? selectedMatakuliah.id_matkul : null;

  // Cek jika kelas sudah ada
  const isClassExist = kelasData.some(
    kelas => kelas.matakuliah === listKelasData.matakuliah && kelas.kelas === listKelasData.kelas
  );

  if (isClassExist) {
    alert("Kelas ini sudah ada.");
    return; 
  }

  const dataToSend = {
    matkul_id: id_matkul,
    skala: listKelasData.skala,
    kelas: listKelasData.kelas,
    dosen_ids: selectedDosenIds,
    kapasitas: listKelasData.kapasitas,
  };

  try {
    const response = await fetch('http://127.0.0.1:5000/api/kelasadd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      // After adding, re-fetch all classes from the backend
      const updatedKelasData = await fetch('http://127.0.0.1:5000/api/listkelas')
        .then(res => res.json())
        .catch(error => console.error('Error fetching kelas data:', error));
      // Update state with the fetched kelas data
      setKelasData(updatedKelasData);
      setListKelasData({
        matakuliah: '',
        kelas: '',
        dosen: [],
        kapasitas: '',
        skala: '',
      });
      setIsAddModalOpen(false);
    } else {
      console.error('Failed to add kelas');
    }
  } catch (error) {
    console.error('Error adding kelas:', error);
  }
};
 
  

  const handleDeleteMatakuliah = (id_kelas, kelas) => {
    setKelasToDelete({ id_kelas, kelas });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmationText === `delete`) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/kelasdelete/${kelasToDelete.id_kelas}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Perbarui state untuk menghapus kelas dari daftar kelas yang ada
                setKelasData(kelasData.filter(kelas => kelas.id_kelas !== kelasToDelete.id_kelas));
                setIsDeleteDialogOpen(false); // Tutup dialog setelah berhasil
                setConfirmationText(''); // Reset teks konfirmasi
            } else {
                console.error('Gagal menghapus kelas');
            }
        } catch (error) {
            console.error("Error menghapus kelas: ", error);
        }
    } else {
        alert("Teks konfirmasi tidak cocok.");
    }
};  

  useEffect(() => {
    if (listKelasData.matakuliah && listKelasData.skala) {
      let newKelas = '';
      const namaMatkul = listKelasData.matakuliah.split(' - ')[1] || listKelasData.matakuliah;
      const existingClasses = kelasData
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
        const matkulData = matakuliahsData.find(item => item.matakuliah === namaMatkul);
        if (matkulData && matkulData.wp === 'P') { // Hanya mata kuliah pilihan
          if (!existingClasses.includes(`${namaMatkul}. MBKM`)) {
            newKelas = `${namaMatkul}. MBKM`;
          } else {
            setSkalaWarning('Hanya bisa ada satu kelas "MBKM" untuk mata kuliah ini.');
          }
        } else {
          setSkalaWarning('Hanya mata kuliah pilihan yang bisa dimasukkan ke skala "MBKM".');
        }
      }
  
      
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
  }, [listKelasData.matakuliah, listKelasData.skala, kelasData,matakuliahsData]);
  

  const columns = [
    { 
      accessorKey: 'no', 
      header: 'No', 
      Cell: ({ row }) => row.index + 1, 
      enableSorting: false, 
  },
    { accessorKey: 'matakuliah', header: 'Matakuliah' },
    { accessorKey: 'kelas', header: 'Kelas', enableSorting: true },
    {
      accessorKey: 'dosen',
      header: 'Dosen',
      Cell: ({ row }) => {
        const dosenData = row.original.dosen;
        return (
          <div style={{ whiteSpace: 'pre-line' }}>
          {dosenData.split('\n').map((dosen, index) => (
          <div key={index}>{dosen}</div>
        ))}
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
          <MdEdit color='blue' size={20} onClick={() => handleEditKelas(row.original)} />
          <MdDelete color='red' size={20} onClick={() => handleDeleteMatakuliah(row.original.id_kelas, row.original.kelas)} />
        </div>
      ),
    },
  ];
  
  const table = useMaterialReactTable({
    columns,
    data: kelasData, 
    enableRowSelection: false,
    initialState: {
      pagination: { pageSize: 26, pageIndex: 2 },
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
        <DialogTitle>Delete Kelas</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
        {/* <Typography>Are you sure you want to delete :</Typography> */}
        <Typography className='dialog-delete'>apakah anda ingin menghapus "{kelasToDelete.kelas}"?</Typography>
          <TextField fullWidth label="Enter `delete` to Confirm" value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>delete</Button>
        </DialogActions>
      </Dialog>

      <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 500 }}>
            <Typography variant="h6">Tambah Kelas
              <IconButton onClick={handleCloseAddModal} style={{ float: 'right' }}><CloseIcon color='primary'></CloseIcon></IconButton>
            </Typography>
            <form onSubmit={handleAddKelas}>
              <Grid container spacing={2}>
                {/* input matakuliah */}
                <Grid item xs={12}>
                <Autocomplete
                  options={matakuliahsData.map((matkul) => ({
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
                {/* input skala */}
                <Grid item xs={12}>
                  <TextField select fullWidth 
                    label="Skala" 
                    name="skala" 
                    value={listKelasData.skala} 
                    onChange={handleChange} 
                    error={!!skalaWarning} 
                    helperText={skalaWarning} 
                  required>
                    <MenuItem value="Nasional">Nasional</MenuItem>
                    <MenuItem value="Inter">Internasional</MenuItem>
                    <MenuItem value="MBKM">MBKM</MenuItem>
                  </TextField>
                </Grid>
                {/* input kelas */}
                <Grid item xs={12}>
                  <TextField fullWidth 
                    label="Kelas" 
                    name="kelas" 
                    value={listKelasData.kelas} 
                    onChange={handleChange} 
                    disabled={!!skalaWarning}
                    required 
                  />
                </Grid>
                {/* input dosen */}
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
                        helperText={dosenError ? "Silakan pilih maksimal 3 dosen." : ""} 
                        // required 
                      />
                    )}
                    value={listKelasData.dosen}
                    onChange={(event, newValue) => {
                      if (newValue.length <= 3) { 
                        setListKelasData({ ...listKelasData, dosen: newValue });
                        setDosenError(false);
                      } else {
                        setDosenError(true);
                      }
                    }}
                    onBlur={() => {
                      setDosenError(listKelasData.dosen.length === 0 || listKelasData.dosen.length > 3);
                    }}
                    disableCloseOnSelect
                  />
                </Grid>
                {/* input kapasitas */}
                <Grid item xs={12}>
                  <TextField fullWidth label="Kapasitas" name="kapasitas" value={listKelasData.kapasitas} onChange={handleChange} required />
                </Grid>
              </Grid>
            <Button fullWidth type="submit" variant="contained" color="primary" disabled={!!skalaWarning} sx={{ mt: 2 }}>Tambah</Button>
          </form>
        </Box>
      </Modal>

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 500,
          }}
        >
          <Typography variant="h6">
            Edit Kelas
            <IconButton
              onClick={() => setIsEditModalOpen(false)}
              style={{ float: 'right' }}
            >
              <CloseIcon color="primary" />
            </IconButton>
          </Typography>
          <form onSubmit={handleUpdateKelas}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Matakuliah"
                  name="matakuliah"
                  value={kelasToEdit.matakuliah || ''}
                  onChange={(e) =>
                    setKelasToEdit({ ...kelasToEdit, matakuliah: e.target.value })
                  }
                  disabled
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Skala"
                  name="skala"
                  value={kelasToEdit.skala || ''}
                  onChange={(e) =>
                    setKelasToEdit({ ...kelasToEdit, skala: e.target.value })
                  }
                  required
                >
                  <MenuItem value="Nasional">Nasional</MenuItem>
                  <MenuItem value="Inter">Internasional</MenuItem>
                  <MenuItem value="MBKM">MBKM</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Kelas"
                  name="kelas"
                  value={kelasToEdit.kelas || ''}
                  onChange={(e) =>
                    setKelasToEdit({ ...kelasToEdit, kelas: e.target.value })
                  }
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
                      error={dosenErrors}
                      helperText={
                        dosenErrors ? 'Silakan pilih maksimal 3 dosen.' : ''
                      }
                    />
                  )}
                  value={kelasToEdit.dosen || []}
                  onChange={(event, newValue) => {
                    if (newValue.length <= 3) {
                      setKelasToEdit({ ...kelasToEdit, dosen: newValue });
                      setDosenErrors(false);
                    } else {
                      setDosenErrors(true);
                    }
                  }}
                  disableCloseOnSelect
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Kapasitas"
                  name="kapasitas"
                  value={kelasToEdit.kapasitas || ''}
                  onChange={(e) =>
                    setKelasToEdit({ ...kelasToEdit, kapasitas: e.target.value })
                  }
                  required
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Update
            </Button>
          </form>
        </Box>
      </Modal>
      </div>
    </div>
  );
};

export default AddKelas;
