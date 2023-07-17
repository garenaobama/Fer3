import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import { Container } from "react-bootstrap";
import * as bcrypt from "bcryptjs";

const ChangePassword = () => {
    const { id } = useParams();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [user, setUser] = useState([]);
    
    useEffect(()=>{
        fetch('http://localhost:9999/users/' + id)
        .then(res => res.json())
        .then(json => setUser(json))
    },[]
    )

    const handleChange = (e) => {
        setError("");
        setSuccess("");
        if (e.target.name === "currentPassword") {
            setCurrentPassword(e.target.value);
        } else if (e.target.name === "newPassword") {
            setNewPassword(e.target.value);
        } else if (e.target.name === "confirmPassword") {
            setConfirmPassword(e.target.value);
        }
    };
    const hash = (password) => {
        return bcrypt.hashSync(password, 10);
      };
    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        let passwordHash = hash(newPassword)

        console.log('http://localhost:9999/users/' + id)

        fetch('http://localhost:9999/users/' + id, {
            method: 'PUT',
            body: JSON.stringify({
                ...user,
                password: passwordHash
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })

        window.alert("password changed")
    };

    return (
        <>
            <Meta title={"Sign Up"} />
            <BreadCrumb title="Sign Up" />
            <Container class1="login-wrapper py-5 home-wrapper-2">
                <div className="change-password-container">
                    <h2>Change Password</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Current Password:
                            <input
                                type="password"
                                name="currentPassword"
                                value={currentPassword}
                                onChange={handleChange}
                            />
                        </label>
                        <br />
                        <label>
                            New Password:
                            <input
                                type="password"
                                name="newPassword"
                                value={newPassword}
                                onChange={handleChange}
                            />
                        </label>
                        <br />
                        <label>
                            Confirm Password:
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleChange}
                            />
                        </label>
                        <br />
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}
                        <button type="submit">Change Password</button>
                    </form>
                </div>
            </Container>
        </>
    );
};

export default ChangePassword;
