import React,{useState,useEffect} from 'react';
import { Avatar } from '@material-ui/core';
import './SidebarChat.css';
import db from './firebase.js'
import { Link,useHistory } from 'react-router-dom';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { useStateValue } from './StateProvider';
import EmailValidator from 'email-validator';
import {useCollection} from "react-firebase-hooks/firestore";
import getRecipientEmail from './getRecipientEmail';



const SidebarChat = ({addNewChat,id,users}) =>{
  const history = useHistory();
    const [{user},dispatch] = useStateValue();
    const [officialuser,setOfficialuser] = useState([]);
   
   const recipientEmail = getRecipientEmail(users,user)?getRecipientEmail(users,user):null; 
    
//  const [seed, setSeed] = useState('');
 const [messages, setMessages] = useState("");

 const useChatRef = db.collection('rooms').where('users', 'array-contains', user.email);
 const [roomsSnapshot] = useCollection(useChatRef);
  
 const [recipientSnapshot] = useCollection(
     db.collection("users").where("email", "==", recipientEmail)
     );
 const recipient = recipientSnapshot?.docs?.[0]?.data();
//  console.log(recipientEmail);

useEffect(() => {
    history.push(`/rooms/${id}`);
},[id])

 useEffect(() =>{
     if(id) {
         db.collection('rooms')
           .doc(id)
           .collection('messages')
           .orderBy('timestamp','desc')
           .onSnapshot(snapshot => (
               setMessages(snapshot.docs.map(doc => doc.data()))
           ))
     }
 },[id])


 useEffect(()=>{
       db.collection('users').onSnapshot(snapshot => (
         setOfficialuser(snapshot.docs.map(doc => (doc.data().email)))
       ))
     },[])
     
     
     

 


 
 const createChat = () =>{
     const receiverEmail = prompt("Please enter email of the user");
    
     const isOfficialuser = officialuser.includes(receiverEmail);
    
     if(isOfficialuser && EmailValidator.validate(receiverEmail) && !chatAlreadyExists(receiverEmail) && receiverEmail !== user.email){
         //we add the chat into DB 'rooms' collection if it does not already exist and is valid
        db.collection('rooms').add({
           users: [user.email, receiverEmail]
        })
     }
     else{
        alert(receiverEmail+" is NOT RIGESTERED OR ASK USER TO LOGIN");
     } 
     
     
 };

 const chatAlreadyExists = (recipientEmail) =>{
  return !!roomsSnapshot.docs.find((chat) => chat.data().users.find((user) => user === recipientEmail)?.length >0);

 }
    
    return !addNewChat?(
      <Link to={`/rooms/${id}`} >  
        <div className="sidebar_chat">
            {recipient?(<Avatar src={recipient?.photoURL}/>):(
            <Avatar>{recipientEmail[0]}</Avatar>
             )}  
       
       <div className="sidebarchat_info">
           <h2>{recipient?.name}</h2>
           <p>{messages[0]?.message?.substring(0,17)}</p>
       </div>
        </div>
        </Link>
    ):(
        <div onClick={createChat} className="sidebar_chat fixed">
            <GroupAddIcon/>
            <h5>ENTER EMAIL ID</h5>
        </div>
    )
}

export default SidebarChat;