import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Assuming you have this hook

const AdminRoute = () => {
    const { auth } = useAuth();
    const location = useLocation();

    // This check is simple.
    // 1. Is the user logged in (auth?.user exists)?
    // 2. Is the user's role 'admin'?
    
    if (!auth?.user) {
        // Not logged in at all, redirect to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Logged in, but is NOT admin
    if (auth.user.role !== 'admin') {
        // Redirect non-admins to the home page
        return <Navigate to="/home" state={{ from: location }} replace />;
    }

    // If we are here, user is logged in AND is an admin.
    // We can render the component (in your case, <Admin />)
    return <Outlet />; // or you can pass {children} and return children
};

export default AdminRoute;