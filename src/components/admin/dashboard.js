import React from 'react';
import AdminLayout from '../../hoc/adminLayout';

const Dashboard = (props) => {
    
    return (
        <AdminLayout title="Dashboard">
            <div className="user_dashboard">
                <div>
                    This is your dashboard
                </div>

            </div>
        </AdminLayout>
    );
};

export default Dashboard;