import "./navbar.css"
import UserMenu from "../UserMenu/UserMenu";
const Navbar = () => {


    return <header>
        <nav className = "navbar">
            <div className = "logo">
                <a href="">PalestineAid</a>
            </div>

           <ul class="navbar-links">
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/services">Services</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>

    <UserMenu />


        </nav>

    </header>
}



export default Navbar;