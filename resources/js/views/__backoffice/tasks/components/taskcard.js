import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Popover,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemIcon,
    IconButton,
    Menu,
    MenuItem
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import UpdateTask from './crud/update-task';
import DeleteTask from './crud/delete-task';

const styles = theme => ({
    card: {
        marginBottom: theme.spacing.unit * 2,
        cursor: 'pointer',
        '&:hover': {
            '& $moreButton': {  // Card'a hover yapılınca moreButton'u göster
                opacity: 1
            }
        }
    },
    cardContent: {
        padding: theme.spacing.unit * 2,
        '&:last-child': {
            paddingBottom: theme.spacing.unit * 2
        }
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.unit * 2
    },
    dates: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
    },
    dateText: {
        fontSize: 12,
        color: theme.palette.text.secondary
    },
    commonAvatar: {
        width: 32,
        height: 32,
        fontSize: '0.85rem',
        padding: '6px',
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark
        }
    },
    unassignedAvatar: {
        backgroundColor: theme.palette.grey[300],
        '&:hover': {
            backgroundColor: theme.palette.grey[400]
        }
    },
    popover: {
        marginTop: theme.spacing.unit
    },
    popoverList: {
        width: 250,
        maxHeight: 300,
        padding: theme.spacing.unit
    },
    listItem: {
        borderRadius: theme.shape.borderRadius,
        '&:hover': {
            backgroundColor: theme.palette.grey[100]
        }
    },
    listItemText: {
        margin: 0
    },
    primaryText: {
        fontSize: 14,
        fontWeight: 500
    },
    secondaryText: {
        fontSize: 12
    },
    listItemAvatar: {
        minWidth: 32,
        '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            fontSize: '0.85rem',
            padding: '6px',
            backgroundColor: theme.palette.grey[300],
            '&:hover': {
                backgroundColor: theme.palette.grey[400]
            }
        }
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.unit
    },
    moreButton: {
        padding: 4,
        marginRight: -8,
        marginTop: -4,
        opacity: 0,  // Başlangıçta gizli
        transition: 'opacity 0.2s ease-in-out'
    },
    menuItem: {
        minHeight: 38,
        borderRadius: theme.shape.borderRadius,
        padding: '8px 12px',
        gap: theme.spacing.unit,
        '&:hover': {
            backgroundColor: 'rgba(58, 53, 65, 0.04)'
        },
    },
    menuIcon: {
        minWidth: 32,
        color: theme.palette.text.secondary,
        '& .MuiSvgIcon-root': {
            fontSize: '1.25rem'
        }
    },
    menuText: {
        '& .MuiTypography-root': {
            fontSize: '0.675rem'
        }
    },
    deleteMenuItem: {
        '&:hover': {
            backgroundColor: 'rgba(231, 76, 60, 0.04)',
            '& .MuiListItemIcon-root': {
                color: theme.palette.error.main
            },
            '& .MuiTypography-root': {
                color: theme.palette.error.main
            }
        }
    },
    menu: {
        '& .MuiPaper-root': {
            border: '1px solid #E0E0E0 !important',
            borderRadius: '8px',
            padding: '8px',
            minWidth: 180
        }
    }
});

const TaskCard = ({
    classes,
    task,
    onTaskUpdate,
    onTaskDelete
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const users = [
        { id: 1, name: 'Furkan Leylek', email: 'furkan@example.com' },
        { id: 2, name: 'Ahmet Yılmaz', email: 'ahmet@example.com' },
        { id: 3, name: 'Mehmet Demirrrr', email: 'mehmet@example.com' }
    ];

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    const handleAvatarClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAssign = (user) => {
        console.log('Assigned to:', user);
        handleClose();
    };

    const handleTaskUpdate = (updatedTask) => {
        setIsUpdateModalOpen(false);

        if (updatedTask && onTaskUpdate) {
            onTaskUpdate(updatedTask);
        }
    };

    const handleMenuClick = (event) => {
        event.stopPropagation();  // Card click'i engelle
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event) => {
        if (event) event.stopPropagation();
        setMenuAnchorEl(null);
    };

    const handleUpdate = (event) => {
        handleMenuClose(event);
        setIsUpdateModalOpen(true);
    };

    const handleDelete = (event) => {
        handleMenuClose(event);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        setIsDeleteModalOpen(false);
        if (onTaskDelete) {
            console.log("task.id:",task.id);
            onTaskDelete(task.id);
        }
    };

    return (
        <>
            <Card
                className={classes.card}
                onClick={() => setIsUpdateModalOpen(true)}
            >
                <CardContent className={classes.cardContent}>
                    <div className={classes.cardHeader}>
                        <Typography variant="subtitle1">
                            {task.title}
                        </Typography>

                        <IconButton
                            className={classes.moreButton}
                            onClick={handleMenuClick}
                            size="small"
                        >
                            <MoreVertIcon fontSize="small" color="primary" />
                        </IconButton>
                    </div>
                    <Typography variant="body2" color="textSecondary">
                        {task.description}
                    </Typography>

                    <div className={classes.footer}>
                        <div className={classes.dates}>
                            <Typography className={classes.dateText}>
                                {moment(task.start_date).format('DD/MM/YYYY HH:mm')}
                            </Typography>
                        </div>

                        <Avatar
                            className={`${classes.commonAvatar} ${!task.assigned_user && classes.unassignedAvatar}`}
                            onClick={handleAvatarClick}
                        >
                            {task.assigned_user ? getInitials(task.assigned_user.name) : <PersonIcon />}
                        </Avatar>
                    </div>
                </CardContent>
            </Card>

            <DeleteTask
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleDeleteConfirm}
            />

            <UpdateTask
                open={isUpdateModalOpen}
                onClose={handleTaskUpdate}
                task={task}
            />

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                classes={{
                    paper: classes.popover
                }}
            >
                <List className={classes.popoverList}>
                    {users.map(user => (
                        <ListItem
                            button
                            key={user.id}
                            onClick={() => handleAssign(user)}
                            className={classes.listItem}
                        >
                            <ListItemAvatar className={classes.listItemAvatar}>
                                <Avatar className={classes.commonAvatar}>
                                    {getInitials(user.name)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                classes={{
                                    primary: classes.primaryText,
                                    secondary: classes.secondaryText
                                }}
                                primary={user.name}
                                secondary={user.email}
                            />
                        </ListItem>
                    ))}
                </List>
            </Popover>

            {/* More Menu */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    style: {
                        border: '1px solid #E0E0E0',
                        borderRadius: '8px',
                    }
                }}
            >
                <MenuItem
                    onClick={handleUpdate}
                    className={classes.menuItem}
                >
                    <ListItemIcon className={classes.menuIcon}>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Edit"
                        className={classes.menuText}
                    />
                </MenuItem>

                <MenuItem
                    onClick={handleDelete}
                    className={`${classes.menuItem} ${classes.deleteMenuItem}`}
                >
                    <ListItemIcon className={classes.menuIcon}>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Delete"
                        className={classes.menuText}
                    />
                </MenuItem>
            </Menu>
        </>
    );
};

export default withStyles(styles)(TaskCard); 