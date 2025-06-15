import axios from "axios";
import Navbar from "../Components/navbar/navbar.jsx"
import Welcome from "../Components/welcome/Welcome.jsx";
import { useNavigate } from "react-router-dom"; 
import { useEffect } from "react";
const Dashboard = () => {
  
    const navigate = useNavigate();


    useEffect(() => {
        const checkAuth =async () => {
            try {
                 await axios.post(' http://localhost:5000/api/auth/is-auth' ,{} ,{
                    withCredentials : true
                });

            }
            catch(err){
                navigate('/login')
            }
        }

        checkAuth();
    } , [])
return (


    <>
    <Navbar />
    <Welcome />

    


    </>
    
)


}


export default Dashboard;