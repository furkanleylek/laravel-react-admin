import React, { useState } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CheckIcon from '@material-ui/icons/Check';
import TaskCard from './taskcard';

const styles = theme => ({
    column: {
        backgroundColor: theme.palette.grey[100],
        borderRadius: theme.shape.borderRadius,
        borderRight: `1px solid ${theme.palette.grey[200]}`,
        borderLeft: `1px solid ${theme.palette.grey[200]}`,
        boxShadow: 'none',
        minHeight: '100%',
        marginRight: theme.spacing.unit * 1,
    },
    columnTitle: {
        padding: theme.spacing.unit * 2,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        color: theme.palette.text.primary
    },
    columnCount: {
        marginLeft: theme.spacing.unit,
        color: theme.palette.text.secondary
    },
    taskList: {
    }
});

const Column = ({ classes, title, tasks = [], showCheckIcon = false, columnId }) => (
    <Grid item xs={12} md={4}>
        <Paper className={classes.column}>
            <div className={classes.columnTitle}>
                <Typography variant="h6">
                    {title}
                </Typography>
                <span className={classes.columnCount}>
                    {tasks.length}
                </span>
                {showCheckIcon && <CheckIcon className={classes.checkIcon} />}
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
                                            title={task.title}
                                            description={task.description}
                                            startDate={task.startDate}
                                            assignee={task.assignee}
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
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: "Login sayfası tasarımı",
            description: "Yeni login sayfası için UI/UX tasarımı yapılacak",
            startDate: "2024-02-19",
            status: "TODO"
        },
        {
            id: 2,
            title: "API entegrasyonu",
            description: "Backend API'ları ile frontend entegrasyonu sağlanacak",
            startDate: "2024-02-20",
            status: "IN_PROGRESS"
        },
        {
            id: 3,
            title: "Test yazımı",
            description: "Yeni özellikler için unit testler yazılacak",
            startDate: "2024-02-21",
            status: "DONE"
        },
        {
            id: 4,
            title: "Bug fix #123",
            description: "Login formundaki validation hatası düzeltilecek",
            startDate: "2024-02-22",
            status: "TODO"
        },
        {
            id: 5,
            title: "Bug fix #123",
            description: "Login formundaki validation hatası düzeltilecek",
            startDate: "2024-02-22",
            status: "TODO"
        },
        {
            id: 6,
            title: "Bug fix #123",
            description: "Login formundaki validation hatası düzeltilecek",
            startDate: "2024-02-22",
            status: "TODO"
        },
        {
            id: 7,
            title: "Bug fix #123",
            description: "Login formundaki validation hatası düzeltilecek",
            startDate: "2024-02-22",
            status: "TODO"
        },
        {
            id: 8,
            title: "Bug fix #123",
            description: "Login formundaki validation hatası düzeltilecek",
            startDate: "2024-02-22",
            status: "DONE"
        },
        {
            id: 9,
            title: "Bug fix #123",
            description: "Login formundaki validation hatası düzeltilecek",
            startDate: "2024-02-22",
            status: "DONE"
        },
        {
            id: 10,
            title: "Bug fix #123",
            description: "Login formundaki validation hatası düzeltilecek",
            startDate: "2024-02-22",
            status: "DONE"
        },
        {
            id: 11,
            title: "Bug fix #123",
            description: "Login formundaki validation hatası düzeltilecek",
            startDate: "2024-02-22",
            status: "DONE"
        },
        {
            id: 12,
            title: "Bug fix #123",
            description: "Login formundaki validation hatası düzeltilecek",
            startDate: "2024-02-22",
            status: "DONE"
        },
        {
            id: 13,
            title: "Bug fix #123",
            description: "Login formundaki validation hatası düzeltilecek",
            startDate: "2024-02-22",
            status: "DONE"
        }
    ]);

    const handleDragEnd = (result) => {
        /* 
        // Örnek result objesi
        const result = {
            draggableId: "5",  // sürüklenen task id si
            type: "DEFAULT",   // sürükleme tipi

            source: {                     // sürüklemenin basladigi yer
                droppableId: "TODO",      // baslangic kolonu
                index: 2                  // baslangictaki pozisyonu
            },

            destination: {    // sürüklemenin bittigi yer
                droppableId: "IN_PROGRESS",  // hedef kolon
                index: 0               // birakildigi pozisyon
            }
        };

        */
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        const task = tasks.find(t => t.id.toString() === draggableId);

        const newTasks = tasks.filter(t => t.id.toString() !== draggableId); // out dragged task

        const updatedTask = {
            ...task,
            status: destination.droppableId
        };

        newTasks.splice(destination.index, 0, updatedTask);

        setTasks(newTasks);

        console.log(`task ${draggableId} moved to ${destination.droppableId}`);
    };

    const todoTasks = tasks.filter(task => task.status === "TODO");
    const inProgressTasks = tasks.filter(task => task.status === "IN_PROGRESS");
    const doneTasks = tasks.filter(task => task.status === "DONE");

    const columns = [
        { id: "TODO", title: "TO DO", tasks: todoTasks, showCheckIcon: false },
        { id: "IN_PROGRESS", title: "IN PROGRESS", tasks: inProgressTasks, showCheckIcon: false },
        { id: "DONE", title: "DONE", tasks: doneTasks, showCheckIcon: true }
    ];

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Grid container spacing={3}>
                {columns.map((column, index) => (
                    <Column
                        key={column.id}
                        classes={classes}
                        columnId={column.id}
                        title={column.title}
                        tasks={column.tasks}
                        showCheckIcon={column.showCheckIcon}
                    />
                ))}
            </Grid>
        </DragDropContext>
    );
};

export default withStyles(styles)(TaskBoard);