import {useState , useEffect , useRef} from "react"
import {toast} from "react-toastify"
import axios from "axios"
import { useNavigate , Link } from "react-router-dom"
import "./UserMenu.css"


const UserMenu = () =>{

    const [open    , setOpen] = useState(false)
    const menuRef = useRef();
    const Navigate = useNavigate();
    const toggleMenu = () => setOpen(!open);

    const handleClickOutside = (e) => {
        if(menuRef.current && !menuRef.current.contains(e.target)){
            setOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown' , handleClickOutside)
        return () =>document.removeEventListener('mousedown' , handleClickOutside)
    } , [])


    
    const handleLogout = async () => {
        
        try{
         const res = await axios.post("http://localhost:5000/api/auth/logout" , {} , {withCredentials:true});
        // console.log(res);
        const message = res.data.message;
        toast.success(message);
        Navigate('/login') 
      
        }
        catch(err){
            const errMsg = err.response?.data?.message || "Unable to Logout"
            toast.error(errMsg)
        }

    }








     const handleVerification = () => {
        alert("Verificiaton ......")
     }




   
    
    const handleProfile = () => {
        alert("Going to profile...")
    }

    return (
        <div className="user-menu" ref ={menuRef}>
            <img src="../../Images/pfp.jpg" 
            alt="profile"
            className = "profile-avatar"
            onClick = {toggleMenu} />
            {open && (
                <div className="dropdown-menu">
                    <button onClick = {handleProfile}>See Profile</button>
                    <button onClick = {handleLogout}>Logout</button>
                    <button onClick = {handleVerification}>Verify Account</button>
                </div>
            )}
        </div>
    )
}


export default UserMenu;

//useREf hook does not cause re-renders when state changes
//useREf returns a current object
//it can be used to direclty access a dom element