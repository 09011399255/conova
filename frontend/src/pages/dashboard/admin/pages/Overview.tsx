import BookingSection from "./BookingSection"
import Cards from "../components/Cards"
import { useAdmin } from "../../../../contexts/AdminContext";
import NotificationsList from "../../employee/Notifications";
import ScheduleList from "../../employee/ScheduleList";

const Overview = () => {
    const { isAdmin } = useAdmin();
    return (
        <>
            {
                isAdmin ?
                    <>
                        <Cards />
                        <BookingSection />
                    </>
                    :
                    <>
                        <Cards />
                        <NotificationsList />
                        <ScheduleList />
                    </>
            }

        </>
    )
}

export default Overview