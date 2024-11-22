import React, { useState, useEffect, useRef } from 'react'
import Pusher from 'pusher-js';
import { useApp } from '../../../../AppContext';

function GetNotification() {
    const { user, addNotification } = useApp();
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (!user) return;

        console.log('1. useEffect başladı');

        const pusher = new Pusher('2c6d3f63187c6cee1dac', {
            cluster: 'eu',
            encrypted: true,
            debug: true
        });

        pusher.connection.bind('connected', () => {
            if (isMounted.current) {
                console.log('2. Pusher bağlandı!');
            }
        });

        const channel = pusher.subscribe(`task-notifications-channel.${user.id}`);

        channel.bind('notification-created', (data) => {
            if (isMounted.current) {
                console.log('3. Event alındı:', data);
                addNotification(data);
            }
        });

        return () => {
            isMounted.current = false;
            channel.unbind_all();
            pusher.unsubscribe(`task-notifications-channel.${user.id}`);
            pusher.disconnect();
        };
    }, [user]);

    return null;
}

export default GetNotification