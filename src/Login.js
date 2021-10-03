import React,{useState} from 'react';
import "./Login.css";
import { Button } from '@material-ui/core';
import { auth,provider  } from './firebase';

import { useStateValue } from "./StateProvider";

const Login = ()=>{
    const [{}, dispatch] = useStateValue();

    const signIn = ()=>{
       auth.signInWithPopup(provider)
    //    .then(result => {
          
    //    })
       .catch((error) => alert(error.message));
    }
    return(
        <div className="login">
         <div className="login_container">
             <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" alt="" />
             <div className="login_text">
                 <h1>sign in to chatdom</h1>
             </div>

             <Button onClick={signIn}>sign in with google</Button>
         </div>
        </div>
    )
}

export default Login;