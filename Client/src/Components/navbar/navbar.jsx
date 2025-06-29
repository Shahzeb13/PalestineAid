import "./navbar.css"
import UserMenu from "../UserMenu/UserMenu";
import { useAuth } from "../../Context/AuthContext";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <header className="navbar-header">
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to="/" className="logo">
                        <span className="logo-icon">🤝</span>
                        <span className="logo-text">PalestineAid</span>
                    </Link>
                </div>

                <div className="navbar-menu">
                    <ul className="navbar-links">
                        <li className={isActive('/') ? 'active' : ''}>
                            <Link to="/">
                                <span className="nav-icon">🏠</span>
                                Home
                            </Link>
                        </li>
                        <li className={isActive('/about') ? 'active' : ''}>
                            <Link to="/about">
                                <span className="nav-icon">ℹ️</span>
                                About
                            </Link>
                        </li>
                        <li className={isActive('/services') ? 'active' : ''}>
                            <Link to="/services">
                                <span className="nav-icon">🛠️</span>
                                Services
                            </Link>
                        </li>
                        <li className={isActive('/contact') ? 'active' : ''}>
                            <Link to="/contact">
                                <span className="nav-icon">📞</span>
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="navbar-end">
                    {user ? (
                        <div className="user-welcome">
                            <span className="welcome-text">Welcome, {user.name}</span>
                            <UserMenu />
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="auth-btn login-btn">
                                <span className="btn-icon">🔐</span>
                                Login
                            </Link>
                            <Link to="/register" className="auth-btn register-btn">
                                <span className="btn-icon">📝</span>
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;