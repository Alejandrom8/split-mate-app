import React, { useState, useEffect } from 'react';

export default function useDelayedQuery(query, time) {
    const [delayedQuery, setDelayedQuery] = useState(query);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDelayedQuery(query);
        }, time);
        return () => {
            clearTimeout(timeout);
        };
    }, [query, time]);

    return delayedQuery;
}