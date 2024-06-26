import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"

const POST_USERLOGIN_URL = "http://localhost:3000/users/login";

export default function Login () {

    const initialState = {
        username: "",
        password: "",        
    };

    const [user, setUser] = useState(initialState);
    const [errors, setErrors] = useState(initialState);

    const validateUser = ({ username, password }) => {
        const errors = {};
        if(!username) errors.username = "Ingresar username";
        if(!password) errors.password = "Ingresar password";
        return errors;
    };

    const handleChange = (event) => {
        const { value, name } = event.target;
        setUser({...user, [name]: value});
        setErrors(validateUser({...user, [name]: value }));
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .post(POST_USERLOGIN_URL, user)
            .then(response => response.data)
            .then(data => {
                dispatch(setUserData(data));
                localStorage.setItem("userData", JSON.stringify(data));
                alert(`Usuario logueado...`);
                navigate("/home");
            })     
            .catch((error) => alert(`Acceso denegado: ${error?.response?.data?.message}`));        
    };

    const formData = [
        { label: "Nombre de usuario: ", name: "username", type: "text", placeholder: "Ingrese nombre de usuario..." },
        { label: "Contraseña: ", name: "password", type: "password", placeholder: "Ingrese password..." },
    ];

    return (    
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                {
                    formData.map(({ label, name, type}) => {
                        return (
                            <div key={name} className={styles.inputContainer}>
                                <label htmlFor={name}>{label}</label>
                                <input /* className="" */                                  
                                id={name} 
                                name={name} 
                                type={type}
                                value={user[name]} 
                                placeholder={`Ingresar ${label.toLowerCase()}`} 
                                onChange={handleChange} 
                                />
                                {   
                                    errors[name] && (<span className={styles.errorText}>{errors[name]}</span>)
                                }
                            </div>
                        );
                    })
                }
                <button 
                    type="submit"
                    disabled={Object.keys(user).some(e => !user[e])}
                    className={styles.submitButton}                
                >
                    Ingresar
                </button>
            </form>
        </div>
    )
}