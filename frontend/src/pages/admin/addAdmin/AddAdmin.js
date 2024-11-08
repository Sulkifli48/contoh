import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./add-admin.css";
// import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Modal, TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import {  
  MRT_GlobalFilterTextField as MRT_GLOBAL_FILTER_TEXT_FIELD,
  MRT_TablePagination as MRT_TABLE_BODY_CELL_VALUE, 
  MRT_TableBodyCellValue as MRT_TABLE_PAGINATION,
  // MRT_ToolbarAlertBanner, 
  flexRender, 
  useMaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

const AddAdmin = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState({ id_users: '', name: '' });
  const [confirmationText, setConfirmationText] = useState('');

  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [admins, setAdmins] = useState([]);

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
    setAdminData({ ...adminData, [name]: value });
  };

  const fetchUsers = async () => {
      try {
          const response = await fetch('http://127.0.0.1:5000/api/listusers');
          const data = await response.json();
          console.log(data);
          setAdmins(data);
      } catch (error) {
          console.error("Error fetching data: ", error);
      }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://127.0.0.1:5000/api/usersadd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminData),
        });

        if (response.ok) {
          await fetchUsers();
          setAdminData({ name: '', email: '', password: '' }); 
          setIsAddModalOpen(false);
            console.log(adminData)
        } else {
            console.error('Failed to add User');
        }
    } catch (error) {
        console.error("Error adding matakuliah: ", error);
    }
};

const handleDeleteAdmin = (adminId, name) => {
  setAdminToDelete({ id_users: adminId, name });
  setIsDeleteDialogOpen(true);
};

const handleConfirmDelete = async () => {
  if (confirmationText === `delete`) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/usersdelete/${adminToDelete.id_users}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAdmins(admins.filter(admin => admin.id_users !== adminToDelete.id_users));
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
  { accessorKey: 'name', header: 'Nama' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: "action",
    header: "Action",
    Cell: ({ row }) => (
      <div>
        <MdDelete color='red' size={20} onClick={() => handleDeleteAdmin(row.original.id_users)} />
      </div>
    ),
  },
];


  const table = useMaterialReactTable({
    columns,
    data: admins,
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
        <div className='card-list-admin'>
          <h1>Create Admin</h1>
          <Stack>
            <TableContainer className='border-list-admin'>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
              <button
                style={{ width: '190px', height: '40px', background: '#3F72AF', borderRadius: '40px', color: 'white', fontWeight: 500 }}
                onClick={handleOpenAddModal}
              >
                add admin
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
        <DialogTitle>Delete Admin</DialogTitle>
        <DialogContent>
          <Typography>To confirm deletion, please enter: "delete"</Typography>
          <TextField fullWidth label="Confirmation Text" value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 500 }}>
          <Typography variant="h6">Add Admin
          <IconButton onClick={handleCloseAddModal} style={{float:'right'}}><CloseIcon color='primary'></CloseIcon></IconButton>
          </Typography>
          <form onSubmit={handleAddAdmin}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Nama" name="name" value={adminData.name} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email" name="email" value={adminData.email} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Password" name="password" value={adminData.password} onChange={handleChange} required />
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

export default AddAdmin;
