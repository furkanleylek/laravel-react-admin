import React from 'react';
import { Master as MasterLayout } from './layouts';
import TaskBoard from './tasks/components/taskboard';
import TaskForm from './tasks/components/crud/taskform';
import GetNotification from './tasks/components/get-notification';
function Tasks(props) {

    return (
        <MasterLayout
            {...props}
            pageTitle={Lang.get('navigation.tasks')}
        >
            
            <TaskForm />
            <GetNotification/>
            <TaskBoard />
            
        </MasterLayout>
    );
}

export default Tasks;
