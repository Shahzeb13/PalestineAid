import Navbar from "../Components/navbar.jsx"
import { useLocation } from "react-router-dom";
const Dashboard = () => {
    const location = useLocation();
    const userEmail = location.state?.email || "no-email@example.com";


return (

    <>
    <Navbar />
    </>
    
)


}


export default Dashboard;