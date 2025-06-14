import {useState ,useEffect ,createContext} from "react"
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from "axios"


const Login = () => {
    // const [name , setName] = useState("")
    const navigate = useNavigate();
    const [password , setPassword] = useState("")
    const [email , setEmail] = useState("")
    const EmailContext = createContext(email || "guest");


    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:5000/api/auth/login" ,{
                email,
                password
            },{
                withCredentials : true
            });

            if(!response){
                console.error("Response Object not found")
            }
            const message = response.data.message;
            toast.success(message); // on success

           
            // setName("")
            setPassword("")
            setEmail("")

            navigate('/dashboard');
        }
        catch (err){
           const errMsg = err.response?.data?.message || "Registration failed";
            toast.error(errMsg);
    }
}
    return <div className = "min-h-screen flex items-center justify-center">
        <form  className="w-85 h-130 bg-whitish rounded-lg flex flex-col items-center justify-center  gap-10 font-display " onSubmit={handleSubmit}>
        <h2 className="font-bold text-[1rem]">Login</h2>
        {/* <input type="text" name="name" placeholder="Username" value = {name} onChange={(e) => setName(e.target.value)} className = "border border-grey-200 w-[70%] px-2 py-2 rounded-full "/> */}
        <input type="email" name="email" placeholder="email" value = {email} onChange={(e) => setEmail(e.target.value)} className = "border border-grey-200 w-[70%] px-2 py-2 rounded-full"/>
        <input type="password" name = "password " placeholder="password" value = {password} onChange = {(e) => setPassword(e.target.value)} className = "border border-grey-200 w-[70%] px-2 py-2 rounded-full" />
        <button className = "rounded-full p-2 bg-darkBlue text-white" type = "submit">Login</button>
        </form>
    </div>
    
}

export default Login;