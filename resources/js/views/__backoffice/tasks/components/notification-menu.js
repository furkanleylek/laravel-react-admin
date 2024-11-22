import React, { useState } from 'react';
import {
    Badge,
    ClickAwayListener,
    Grow,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Popper,
    Typography,
    Tooltip,
} from '@material-ui/core';
import { Notifications as NotificationsIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { useApp } from '../../../../AppContext';
import { ChevronRight } from '@material-ui/icons'; 


const styles = {
    listItem: {
        padding: '4px 8px', 
    },
    primaryText: {
        fontWeight: 500,
        fontSize: '0.9rem',
    },
    secondaryText: {
        fontSize: '0.8rem',
        color: '#888',
    },
    notificationPaper: {
        maxHeight: 300,
        overflow: 'auto',
        minWidth: 300,
        padding: '8px',
    },
};

function NotificationMenu({ classes }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const { notifications, notificationCount, setNotificationCount } = useApp();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setNotificationCount(0);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={handleClick}>
                    <Badge badgeContent={notificationCount} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                transition
                disablePortal
                placement="bottom-end"
                style={{ zIndex: 9999 }}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                        <Paper className={classes.notificationPaper}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <List>
                                    {notifications.length === 0 ? (
                                        <ListItem>
                                            <ListItemText
                                                primary="No notifications"
                                                secondary="New notifications will appear here"
                                            />
                                        </ListItem>
                                    ) : (
                                        notifications.map((notification, index) => (
                                            <ListItem
                                                key={index}
                                                divider
                                                className={classes.listItem}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <ChevronRight style={{ marginRight: 8, color: 'green' }} />
                                                            <Typography className={classes.primaryText}>
                                                                {notification.data.message}
                                                            </Typography>
                                                        </div>
                                                    }
                                                    secondary={
                                                        <Typography className={classes.secondaryText}>
                                                            {new Date(
                                                                notification.data.task.created_at
                                                            ).toLocaleString()}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        ))
                                    )}
                                </List>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}

export default withStyles(styles)(NotificationMenu);