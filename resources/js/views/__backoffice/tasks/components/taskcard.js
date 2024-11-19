import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';

const styles = theme => ({
    card: {
        marginBottom: theme.spacing.unit * 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
        },
    },
    title: {
        fontWeight: 500,
        marginBottom: theme.spacing.unit
    },
    description: {
        marginBottom: theme.spacing.unit,
        color: theme.palette.text.secondary
    },
    date: {
        color: theme.palette.text.secondary,
        display: 'flex',
        justifyContent: 'flex-end'
    }
});

const TaskCard = ({ classes, title, description, startDate }) => {
    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="subtitle1" className={classes.title}>
                    {title}
                </Typography>
                <Typography variant="body2" className={classes.description}>
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default withStyles(styles)(TaskCard); 