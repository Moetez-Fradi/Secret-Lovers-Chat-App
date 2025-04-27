import { createContext, useCallback, useEffect, useState } from "react";
import { postRequest } from "../Utils/Services";
import { baseUrl } from "../Utils/Services";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, SetRegisterInfo] = useState(
        {
            username: "",
            email: "",
            password: "",
            gender: "male"
        }
    );
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        username : "",
        password : ""
    });

    useEffect(()=> {
        const user = localStorage.getItem("User");
        setUser(JSON.parse(user));
    }, [])

    const updateRegisterInfo = useCallback((info) => {
        SetRegisterInfo(info);
    }, [registerInfo]);

    const registerUser = useCallback(async(e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);
        const response = await postRequest(`${baseUrl}/users/register`, registerInfo);
        setIsRegisterLoading(false);
        if (response.error){
            return setRegisterError(response);
        }
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    }, [registerInfo]);

    const logout = useCallback(async(e) => {
        localStorage.removeItem("User");
        setUser(null);
    });

    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info);
    }, [loginInfo]);

    const loginUser = useCallback(async(e) => {
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);
        const response = await postRequest(`${baseUrl}/users/login`, loginInfo);
        setIsLoginLoading(false);
        if (response.error){
            return setLoginError(response);
        }
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    }, [loginInfo]);


    return <AuthContext.Provider value={{user,
                                        registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading,
                                        logout,
                                        loginUser, isLoginLoading, loginError, loginInfo, updateLoginInfo
                                    }}>
        {children}
    </AuthContext.Provider>
}