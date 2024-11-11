import React, { useState, 
  // useRef,
   useEffect } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";
import { MdDelete } from "react-icons/md";
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Modal, TextField, Button, Grid, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { MRT_GlobalFilterTextField as MRT_GLOBAL_FILTER_TEXT_FIELD, MRT_TablePagination as MRT_TABLE_BODY_CELL_VALUE, MRT_TableBodyCellValue as MRT_TABLE_PAGINATION, flexRender, useMaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';


const AddMatakuliah = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [matakuliahToDelete, setMatakuliahToDelete] = useState({ id_matkul: '', matakuliah: '' });
  const [confirmationText, setConfirmationText] = useState('');

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
    setMatakuliahData(prevData => ({
      ...prevData,
      [name]: value,
      ...(name === "wp" && value === "P" ? { semester: "All" } : {})
    }));
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
  

  const handleDeleteMatakuliah = (id_matkul, matakuliah) => {
    setMatakuliahToDelete({ id_matkul, matakuliah });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmationText === `delete`) {
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
          {/* <Typography>are you sure you want to delete :</Typography> */}
          <Typography>{matakuliahToDelete.matakuliah}</Typography>
          <TextField fullWidth label="Enter `delete` to Confirm." value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
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
                  disabled={matakuliahData.wp === "P"}
                  required
                >
                  <MenuItem value="Ganjil">Ganjil</MenuItem>
                  <MenuItem value="Genap">Genap</MenuItem>
                  <MenuItem value="All">All</MenuItem>
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

export default AddMatakuliah;
