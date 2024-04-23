import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children, allowedRoles }) {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        // Người dùng chưa đăng nhập
        if (allowedRoles && allowedRoles.includes(1)) {
            // Nếu truy cập vào trang Admin mà chưa đăng nhập, chuyển hướng đến trang Login
            return <Navigate to="/login" state={{ from: location }} replace />;
        } else {
            // Nếu truy cập vào các trang khác mà chưa đăng nhập, cho phép truy cập bình thường
            return children;
        }
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Người dùng không có quyền truy cập vào trang này
        return <Navigate to="/unauthorized" replace />;
    }


    return children;
}
export default PrivateRoute;