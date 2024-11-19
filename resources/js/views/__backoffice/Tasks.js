import React from 'react';
import { Master as MasterLayout } from './layouts';
import TaskBoard from './tasks/components/taskboard';
import TaskForm from './tasks/components/crud/taskform';
function Tasks(props) {

    return (
        <MasterLayout
            {...props}
            pageTitle={Lang.get('navigation.tasks')}
        >
            <TaskForm />
            <TaskBoard />
        </MasterLayout>
    );
}

export default Tasks;
