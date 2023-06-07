import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from "react-redux";
import { loggedIn, loggedOut } from "../redux/action";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
    const state = useSelector(state => state.handleCart)
    const stateLog = useSelector(state => state.handleLog)
    let email = localStorage.getItem('_token') ? jwt_decode(localStorage.getItem('_token'))['email'] : "";
    const navigate = useNavigate();


    const dispatch = useDispatch();

    useEffect(() => {
        // if (localStorage.getItem('_token')) email = jwt_decode(localStorage.getItem('_token'))['email'];

        if (email) dispatch(loggedIn());
        else dispatch(loggedOut());
    }, []);

    function handleLogout() {
        localStorage.clear();
        window.location.href = "/login";
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/"> React Ecommerce</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/product">Products</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center">
                        {
                            !stateLog ? (
                                <>
                                    <NavLink to="/login" className="btn btn-outline-dark m-2"><i className="fa fa-sign-in-alt mr-1"></i> Login</NavLink>
                                    <NavLink to="/register" className="btn btn-outline-dark m-2"><i className="fa fa-user-plus mr-1"></i> Register</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/cart" className="btn btn-outline-dark m-2"><i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length}) </NavLink>
                                    <button onClick={() => handleLogout()} className="btn btn-outline-dark m-2"><i className="fa fa-user-plus mr-1"></i> Logout</button>
                                </>
                            )
                        }
                    </div>
                </div>


            </div>
        </nav>
    )
}

export default Navbar