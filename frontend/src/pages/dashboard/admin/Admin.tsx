import { Outlet } from 'react-router-dom';
import AdminNavbar from './components/AdminNavbar'
import BookingSection from './pages/BookingSection';
import Cards from './components/Cards';

const Admin = () => {
    return (
        <div className='font-manrope pb-[50px] '>
            <AdminNavbar />

            <div className='mt-[250px] max-860:mt-[150px]'>
                <Outlet />
            </div>


        </div>
    )
}

export default Admin;