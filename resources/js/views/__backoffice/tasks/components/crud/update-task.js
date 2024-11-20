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
    Grid,
    Avatar,
    CircularProgress
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const styles = theme => ({
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

const UpdateTask = ({ classes, open, onClose, task, users }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_date: '',
        start_time: '',
        status: '',
        assigned_to: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Task verilerini form'a yükle
    useEffect(() => {
        if (task) {
            setFormData({
                ...task,
                start_date: moment(task.start_date).format('YYYY-MM-DD'),
                start_time: moment(task.start_date).format('HH:mm')
            });
        }
    }, [task]);

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
            start_date: moment(
                `${formData.start_date} ${formData.start_time}`,
                'YYYY-MM-DD HH:mm'
            ).format('YYYY-MM-DD HH:mm:ss')
        };

        try {
            const response = await axios.put(`/api/v1/tasks/${task.id}`, apiFormData);

            if (response.status === 200) {
                toast.success('Görev başarıyla güncellendi');
                onClose(response.data); // Güncellenmiş task'ı geri döndür
            }
        } catch (error) {
            console.error('API Error:', error);
            setError(
                error.response?.data?.message ||
                'Görev güncellenirken bir hata oluştu'
            );
            toast.error('Görev güncellenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog
            open={open}
            onClose={() => !loading && onClose()}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Update Task</DialogTitle>

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
                                    label="Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>

                        <Grid container spacing={2}>
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
                                    <TextField
                                        name="start_time"
                                        label="Start Time"
                                        type="time"
                                        value={formData.start_time}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            step: 300, // 5 dakikalık adımlar
                                        }}
                                        fullWidth
                                    />
                                </FormControl>
                            </Grid>
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
                                <InputLabel shrink>Assigned User</InputLabel>
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
                <Button
                    onClick={() => onClose()}
                    color="secondary"
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} className={classes.buttonProgress} />
                            Updating...
                        </>
                    ) : (
                        'Update'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default withStyles(styles)(UpdateTask);