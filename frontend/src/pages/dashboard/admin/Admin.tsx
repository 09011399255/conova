import { Outlet } from 'react-router-dom';
import AdminNavbar from './components/AdminNavbar'
import BookingSection from './pages/BookingSection';
import Cards from './components/Cards';
import ScrollToTop from './components/ScrollToTop';

const Admin = () => {
    return (
        <div className='font-manrope pb-[50px] '>
            <AdminNavbar />

            <div className='mt-[250px] max-860:mt-[150px]'>
                <ScrollToTop />
                <Outlet />
            </div>


        </div>
    )
}

// localStorage.removeItem("spacesActiveTab");
// localStorage.removeItem("activeTab");

export default Admin;