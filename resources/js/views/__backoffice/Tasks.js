import React from 'react';
import { Typography } from '@material-ui/core';

import { Master as MasterLayout } from './layouts';
import TaskBoard from './tasks/components/taskboard';

function Tasks(props) {

    return (
        <MasterLayout
            {...props}
            pageTitle={Lang.get('navigation.dashboard')}
        >
            <TaskBoard />
        </MasterLayout>
    );
}

export default Tasks;
