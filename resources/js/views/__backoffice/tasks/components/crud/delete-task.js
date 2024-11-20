import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@material-ui/core';

const DeleteTask = ({ open, onClose, onDelete }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete this task?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onDelete} color="secondary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteTask;