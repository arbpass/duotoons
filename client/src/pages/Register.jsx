import React, { useEffect } from 'react'
import { Footer, Navbar } from "../components";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [nickname, setNickname] = useState("");
    const [pass, setPass] = useState("");
    const [cpass, setCpass] = useState("");
    const navigate = useNavigate();


    const handleSubmit = (e) => {
        const response = fetch("register", {
            method: 'POST',
            mode: 'cors',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, nickname, pass, cpass })
        });
        // console.log(response);
        e.preventDefault();
    }

    useEffect(() => {
        let emailToken;
        if (localStorage.getItem('_token')) emailToken = jwt_decode(localStorage.getItem('_token'))['email'];
        if (emailToken) navigate('/');
    }, []);


    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Register</h1>
                <hr />
                <div class="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <div class="form my-3">
                                <label for="Name">Full Name</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="Name"
                                    placeholder="Enter Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div class="form my-3">
                                <label for="Email">Email address</label>
                                <input
                                    type="email"
                                    class="form-control"
                                    id="Email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div class="form  my-3">
                                <label for="Phone">Phone</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="Phone"
                                    placeholder="Phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div class="form  my-3">
                                <label for="Nickname">Nickname</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="Nickname"
                                    placeholder="Nickname"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                />
                            </div>
                            <div class="form  my-3">
                                <label for="Password">Password</label>
                                <input
                                    type="password"
                                    class="form-control"
                                    id="Password"
                                    placeholder="********"
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                />
                            </div>
                            <div class="form  my-3">
                                <label for="CPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    class="form-control"
                                    id="CPassword"
                                    placeholder="********"
                                    value={cpass}
                                    onChange={(e) => setCpass(e.target.value)}
                                />
                            </div>
                            <div className="my-3">
                                <p>Already has an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                            </div>
                            <div className="text-center">
                                <button class="my-2 mx-auto btn btn-dark" type="submit">
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register