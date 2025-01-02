import React from 'react';
import { useParams } from 'react-router-dom';

function PlanPage() {
    const { id } = useParams();

    return (
        <div>
            <h1>Plan Page for ID: {id}</h1>
        </div>
    );
}

export default PlanPage;
