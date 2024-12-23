import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";
import { MdDelete } from "react-icons/md";
import {Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';
import {
  MRT_GlobalFilterTextField as MRT_GLOBAL_FILTER_TEXT_FIELD,
  MRT_TableBodyCellValue as MRT_TABLE_BODY_CELL_VALUE,
  MRT_TablePagination as MRT_TABLE_PAGINATION,
  flexRender,
  useMaterialReactTable
} from 'material-react-table';

const Jadwal = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jadwalToDelete, setJadwalToDelete] = useState({ id: '', namaMatkul: '' });
  const [confirmationText, setConfirmationText] = useState('');
  const [jadwals, setJadwals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchScheduleData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/jadwals1');
      const mergedData = mergeScheduleData(response.data);
      setJadwals(mergedData);
    } catch (err) {
      setError("Gagal mengambil data jadwal. Silakan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshJadwal = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/refresh_jadwal', {
        method: 'PUT',
      });
      const data = await response.json();
      if (data.message === 'Jadwal berhasil diperbarui.') {
        // Setelah refresh, ambil data terbaru
        fetchScheduleData();
      } else {
        alert('Gagal memperbarui jadwal');
      }
    } catch (error) {
      console.error('Error refreshing jadwal:', error);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData]);

  const mergeScheduleData = (jadwalsData) => {
    const mergedSchedule = [];
    jadwalsData.forEach((item) => {
      const existingSchedule = mergedSchedule.find(
        (mergedItem) =>
          mergedItem.kelas === item.kelas &&
          mergedItem.ruangan === item.ruangan &&
          mergedItem.hari === item.hari
      );

      if (existingSchedule) {
        existingSchedule.jam.push(...item.jam);
        existingSchedule.dosen = [...new Set([...existingSchedule.dosen, item.dosen])];
      } else {
        mergedSchedule.push({
          ...item,
          dosen: [item.dosen],
          jam: item.jam,
        });
      }
    });

    mergedSchedule.forEach((item) => {
      if (item.jam.length > 0) {
        const sortedTimes = item.jam.sort((a, b) => {
          const [startA] = a.split(' - ');
          const [startB] = b.split(' - ');
          return startA.localeCompare(startB);
        });
  
        item.jam = `${sortedTimes[0].split(' - ')[0]} - ${sortedTimes[sortedTimes.length - 1].split(' - ')[1]}`;
      }
  
      // Gabungkan semua dosen menjadi satu string
      item.dosenString = item.dosen.join(' - '); 
    });
    console.log(mergedSchedule)

    return mergedSchedule;
  };

  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);

  const handleDeleteJadwal = (jadwalId, nama) => {
    setJadwalToDelete({ id: jadwalId, nama });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setJadwals(jadwals.filter((jadwal) => jadwal.id !== jadwalToDelete.id));
    setIsDeleteDialogOpen(false);
  };

  const columns = [
    { accessorKey: 'hari', header: 'Hari' },
    { accessorKey: 'jam', header: 'Jam' },
    { accessorKey: 'matakuliah', header: 'Nama Mata Kuliah' },    
    { accessorKey: 'kelas', header: 'Kelas' },
    { accessorKey: 'w/p', header: 'W/P' },
    {
      accessorKey: 'dosenString',
      header: 'Dosen',
    },
    { accessorKey: 'ruangan', header: 'Ruangan' },
    {
      accessorKey: 'action',
      header: 'Action',
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
      rowsPerPageOptions: [10, 15, 20, 25, 30],
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <CircularProgress />
              <Typography variant="h6">Loading...</Typography>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Typography color="error">{error}</Typography>
            </div>
          ) : (
            <Stack>
              <TableContainer className='border-list-matakuliah'>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={refreshJadwal} 
                  >
                    Refresh Jadwal
                  </Button>
                  <MRT_GLOBAL_FILTER_TEXT_FIELD table={table} />
                </Box>

                <Table>
                  <TableHead className='border-botton'>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableCell align="center" variant="head" key={header.id}>
                            <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
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
          )}
        </div>

        <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Jadwal</DialogTitle>
          <DialogContent>
            <Typography>Apakah Anda ingin menghapus "{jadwalToDelete.nama}"?</Typography>
            <TextField
              fullWidth
              label="Confirmation Text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleConfirmDelete}>Delete</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Jadwal;
