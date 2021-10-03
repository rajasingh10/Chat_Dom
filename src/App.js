import React,{useState,useEffect} from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom';
import Login from "./Login";
import { useStateValue } from "./StateProvider";
import db,{auth} from "./firebase";
import { actionTypes } from './reducer';
import firebase from "firebase";
// import { useAuthState } from 'react-firebase-hooks';

const App = () =>{
  const [sidebar,setSidebar] = useState(false);
  const [{user}, dispatch] = useStateValue();
//   const [officialuser,setOfficialuser] = useState([]);
 
//    console.log(user);

//  useEffect(()=>{
//    db.collection('officialUser').onSnapshot(snapshot => (
//      setOfficialuser(snapshot.docs.map(doc => (doc.data().email)))
//    ))
//  },[])
//  const email = user?.email;
//  const isOfficialuser = officialuser.includes(email);
//  console.log(isOfficialuser);


// const[newuser,loading] = useAuthState(auth);
// console.log(newuser);

useEffect(()=>{
  if(user){
  db.collection('users').doc(user.uid).set(
    {
    name: user.displayName,  
    email: user.email,
    lastseen: firebase.firestore.FieldValue.serverTimestamp(),
    photoURL: user.photoURL,
    login: true,
  },
  {merge: true}
  );
  }
},[user])


useEffect(()=>{
  auth.onAuthStateChanged(authUser => {
    if(authUser){
      dispatch({
        type: actionTypes.SET_USER,
        User: authUser,
    })
    }
    else{
      dispatch({
        type: actionTypes.SET_USER,
        User: null,
    })
    }
  })
  
},[])
const openSidebar = ()=>{
  if(sidebar){
    setSidebar(false);
  }
  else{
    setSidebar(true);
  }
}
const closeSidebar = ()=>{
  setSidebar(false);
}


  return (
    <div className="app">
      {!user?(
        <Login/>
      ):(
      <div className="app_body">
        <Router>
          <Sidebar sidebar={sidebar} closeSidebar={closeSidebar}/>
          <Switch>
            <Route path="/rooms/:roomId">
            <Chat sidebar={sidebar} openSidebar={openSidebar}/>
            </Route>
            <Route path="/">
            <Chat sidebar={sidebar} openSidebar={openSidebar}/>
            </Route>
            <Route path="/login">
              <Login/>
            </Route>
          </Switch>
        </Router>
      </div>
      )}
    </div>
  );
}

export default App;
