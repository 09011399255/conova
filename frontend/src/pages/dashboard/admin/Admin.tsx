import AdminNavbar from './components/AdminNavbar'
import BookingSection from './components/BookingSection';
import Cards from './components/Cards';

const Admin = () => {
    return (
        <div className='font-manrope pb-[50px] '>
            <AdminNavbar />
            <div className='mt-[250px] max-860:mt-[150px]'>
                <Cards />
                <BookingSection />
            </div>


        </div>
    )
}

export default Admin;