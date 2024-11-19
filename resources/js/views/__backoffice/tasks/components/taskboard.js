import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CheckIcon from '@material-ui/icons/Check';
import TaskCard from './taskcard';
import { taskService } from './services/taskservice';
import { toast } from 'react-hot-toast';
import { Error as ErrorLayout } from '../../../layouts';

const styles = theme => ({
    column: {
        backgroundColor: theme.palette.grey[100],
        borderRadius: theme.shape.borderRadius,
        borderRight: `1px solid ${theme.palette.grey[200]}`,
        borderLeft: `1px solid ${theme.palette.grey[200]}`,
        boxShadow: 'none',
        minHeight: '100%',
        marginRight: theme.spacing.unit * 1.5,
        padding: '4px',
    },
    columnTitle: {
        padding: theme.spacing.unit * 2,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        color: theme.palette.text.primary,
    },
    columnCount: {
        marginLeft: theme.spacing.unit,
        color: theme.palette.text.secondary
    },
    taskList: {
    }
});

const Column = ({ classes, title, tasks = [], showCheckIcon = false, columnId, onTaskUpdate }) => (
    <Grid item xs={12} md={4}>
        <Paper className={classes.column}>
            <div className={classes.columnTitle}>
                <Typography variant="h6">
                    {title}
                </Typography>
                <span className={classes.columnCount}>
                    {tasks.length}
                </span>
                {showCheckIcon && <CheckIcon className={classes.checkIcon} color='primary' />}
            </div>
            <Droppable droppableId={columnId}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={classes.taskList}
                        style={{ minHeight: '100px' }}
                    >
                        {tasks.map((task, index) => (
                            <Draggable
                                key={task.id}
                                draggableId={task.id.toString()}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <TaskCard
                                            task={task}
                                            onTaskUpdate={onTaskUpdate}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </Paper>
    </Grid>
);

const TaskBoard = ({ classes }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getAllTasks();
            console.log("fetchTasks response: ", response)
            setTasks(response || []);
            setError(null);
        } catch (error) {
            console.error('Tasks yüklenirken hata:', error);
            setError('Tasks yüklenemedi');
            toast.error('Tasks yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        try {
            const task = tasks.find(t => t.id.toString() === draggableId);
            const newTasks = tasks.filter(t => t.id.toString() !== draggableId);
            const updatedTask = {
                ...task,
                status: destination.droppableId.toLowerCase()
            };
            newTasks.splice(destination.index, 0, updatedTask);
            setTasks(newTasks);

            await taskService.updateTask(draggableId, {
                status: destination.droppableId.toLowerCase(),
                position: destination.index
            });

            toast.success('Task durumu güncellendi');
        } catch (error) {
            console.error('Task güncellenirken hata:', error);
            toast.error('Task güncellenirken bir hata oluştu');
            fetchTasks();
        }
    };

    const handleTaskUpdate = async (updatedTask) => {
        try {
            const response = await taskService.updateTask(updatedTask.id, updatedTask);
            
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.id === response.id ? response : task
                )
            );
            
            toast.success('Task güncellendi');
        } catch (error) {
            console.error('Task güncellenirken hata:', error);
            toast.error('Task güncellenirken bir hata oluştu');
        }
    };

    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '400px' }}>
                <CircularProgress />
            </Grid>
        );
    }

    if (error) {
        return (
            <ErrorLayout>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </ErrorLayout>
        );
    }

    const todoTasks = tasks.filter(task => task.status === "todo");
    const inProgressTasks = tasks.filter(task => task.status === "inprogress");
    const doneTasks = tasks.filter(task => task.status === "done");

    const columns = [
        { id: "todo", title: "TO DO", tasks: todoTasks, showCheckIcon: false },
        { id: "inprogress", title: "IN PROGRESS", tasks: inProgressTasks, showCheckIcon: false },
        { id: "done", title: "DONE", tasks: doneTasks, showCheckIcon: true }
    ];

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Grid container spacing={3}>
                {columns.map((column) => (
                    <Column
                        key={column.id}
                        classes={classes}
                        columnId={column.id}
                        title={column.title}
                        tasks={column.tasks}
                        showCheckIcon={column.showCheckIcon}
                        onTaskUpdate={handleTaskUpdate}
                    />
                ))}
            </Grid>
        </DragDropContext>
    );
};

export default withStyles(styles)(TaskBoard);