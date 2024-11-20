import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useApp } from '../../../../../AppContext';

const styles = theme => ({
    addButton: {
        marginBottom: theme.spacing.unit * 2,
        position: 'sticky',
        top: 10,
        zIndex: 2,
        minWidth: 'unset',
        width: 40,
        height: 40,
        borderRadius: '50%'
    },
    form: {
        width: '100%',
        marginTop: theme.spacing.unit * 2
    },
    formControl: {
        width: '100%',
        marginBottom: theme.spacing.unit * 2
    },
    buttons: {
        padding: theme.spacing.unit * 2
    },
    userMenuItem: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing.unit
    },
    userAvatar: {
        width: 32,
        height: 32,
        marginRight: theme.spacing.unit * 2,
        backgroundColor: theme.palette.primary.main,
        fontSize: '1rem'
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    userName: {
        fontWeight: 500
    },
    userEmail: {
        fontSize: '0.75rem',
        color: theme.palette.text.secondary
    },
    selectedUserInfo: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing.unit
    }
});

const TaskForm = ({ classes }) => {
    const { refreshTasks } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_date: moment().format('YYYY-MM-DD'),
        status: 'todo'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/v1/users');
                console.log('Users API Response:', response.data);

                if (response.data && response.data.data) {
                    setUsers(response.data.data);
                } else if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error('Unexpected users data format:', response.data);
                    setUsers([]);
                }
            } catch (error) {
                console.error('Kullanıcılar yüklenirken hata:', error);
                setUsers([]);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const apiFormData = {
            ...formData,
            status: formData.status.toLowerCase(),
            start_date: formData.start_date
        };

        try {
            const response = await axios.post('/api/v1/tasks', apiFormData);

            if (response.status === 201) {
                handleReset();
                toast.success('Görev başarıyla oluşturuldu');
                refreshTasks();
            }
        } catch (error) {
            console.error('API Error:', error);
            setError(
                error.response?.data?.message ||
                'Görev oluşturulurken bir hata oluştu'
            );
            toast.error('Görev oluşturulurken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            title: '',
            description: '',
            start_date: moment().format('YYYY-MM-DD'),
            status: 'todo' 
        });
        setIsOpen(false);
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                className={classes.addButton}
                onClick={() => setIsOpen(true)}
            >
                <AddIcon />
            </Button>

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Create New Task</DialogTitle>

                <DialogContent>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        name="title"
                                        label="Title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        name="description"
                                        label="Açıklama"
                                        value={formData.description}
                                        onChange={handleChange}
                                        multiline
                                        rows={4}
                                        fullWidth
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        name="start_date"
                                        label="Start Date"
                                        type="date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        fullWidth
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>Durum</InputLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        fullWidth
                                    >
                                        <MenuItem value="todo">TO-DO</MenuItem>
                                        <MenuItem value="inprogress">IN-PROGRESS</MenuItem>
                                        <MenuItem value="done">DONE</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink>Atanan Kişi</InputLabel>
                                    <Select
                                        name="assigned_to"
                                        value={formData.assigned_to || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        displayEmpty
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                return <em>Select</em>;
                                            }
                                            const selectedUser = users.find(user => user.id === selected);
                                            if (!selectedUser) return <em>Select</em>;
                                            
                                            return (
                                                <div className={classes.selectedUserInfo}>
                                                    <Avatar className={classes.userAvatar}>
                                                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                                                    </Avatar>
                                                    <div className={classes.userInfo}>
                                                        <span className={classes.userName}>{selectedUser.name}</span>
                                                        <span className={classes.userEmail}>{selectedUser.email}</span>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        {Array.isArray(users) && users.map(user => (
                                            <MenuItem key={user.id} value={user.id}>
                                                <div className={classes.userMenuItem}>
                                                    <Avatar className={classes.userAvatar}>
                                                        {user.name.split(' ').map(n => n[0]).join('')}
                                                    </Avatar>
                                                    <div className={classes.userInfo}>
                                                        <span className={classes.userName}>{user.name}</span>
                                                        <span className={classes.userEmail}>{user.email}</span>
                                                    </div>
                                                </div>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>

                <DialogActions className={classes.buttons}>
                    <Button onClick={handleReset} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default withStyles(styles)(TaskForm);