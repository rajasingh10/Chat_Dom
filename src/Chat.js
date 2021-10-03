import React, { useState, useEffect } from 'react'
import './Chat.css'
import { Avatar, IconButton } from '@material-ui/core'
import { SearchOutlined, AttachFile, MoreVert, InsertEmoticon } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import { useParams } from 'react-router';
import db from './firebase';
import { useStateValue } from './StateProvider';
import firebase from 'firebase';
import SendIcon from '@material-ui/icons/Send';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import './Sidebar.css'
import FlipMove from 'react-flip-move';
import ReactScrollToBottom from 'react-scroll-to-bottom'
import getRecipientEmail from './getRecipientEmail';
import { useCollection } from 'react-firebase-hooks/firestore';
import bgimage from './bg.jpg'
import ImageUpload from './ImageUpload';
import CloseIcon from '@material-ui/icons/Close';
import ReactTimeago from 'react-timeago';


const Chat = ({ sidebar, openSidebar }) => {
    const [seed, setSeed] = useState('');
    const [input, setInput] = useState('');
    const { roomId } = useParams();
    const [roomname, setRoomName] = useState('');
    const [messages, setMessages] = useState([]);
    const [{ user }, dispatch] = useStateValue();
    const [users, setUsers] = useState([]);
    const [largeImage,setLargeimage] = useState(false);
    const [imageUrl,setImageurl] = useState(null);


    useEffect(() => {
        if (roomId) {
            db.collection('rooms').doc(roomId)
                .onSnapshot(snapshot => setUsers(snapshot.data()?.users));
        }
    }, [roomId])


    const recipientEmail = getRecipientEmail(users, user) ? getRecipientEmail(users, user) : 0;

    const [recipientSnapshot] = useCollection(
        db.collection("users").where("email", "==", recipientEmail)
    );
    const recipient = recipientSnapshot?.docs?.[0]?.data();



    useEffect(() => {
        const unsubscribe = db.collection('rooms').doc(roomId)
            .collection('messages').orderBy('timestamp', 'asc').onSnapshot(snapshot => (
                setMessages(snapshot.docs.map(doc => doc.data()))
            ))
        return () => {
            unsubscribe();
        }

    }, [roomId])




    const sendMessage = (event) => {
        event.preventDefault();
        if (recipient && input) {
            db.collection('rooms').doc(roomId)
                .collection('messages').add({
                    message: input,
                    name: user.displayName,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
            setInput('')
        }
    }

    if(!recipientEmail){
        return(
            <div className="chat nochathead">
                  <div className="chat_header nochat">
                  <img className="chatlogo" src="https://see.fontimg.com/api/renderfont4/z80eL/eyJyIjoiZnMiLCJoIjo2NiwidyI6MTI1MCwiZnMiOjUzLCJmZ2MiOiIjMDAwMDAwIiwiYmdjIjoiIzg3ODdDQSIsInQiOjF9/Y2hhdGRvbQ/your-dream.png" alt="" />
                <div className="chat_headerRight">
                    <IconButton onClick={openSidebar} className="slide_button">
                        {sidebar ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
            </div>
               <img className="bgimage" src={bgimage} alt="" />
            </div>
        )
    }

    const handleImage =(url)=>{
        setImageurl(url);
        
            setLargeimage(true);
    }

    const handleLargeImage = () =>{
        setImageurl(null);
        setLargeimage(false);
    }

    return (
           
        <div className="chat">
            <div className="chat_header">
                {recipient ? (<Avatar src={recipient?.photoURL} />) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}
                <div className="chat_headerInfo">
                    <h2>{recipient?.name}</h2>
                    {recipient ?<p>last seen{" "}<ReactTimeago date={new Date(recipient?.lastseen?.toDate()).toUTCString()}/></p> : <p>last seen{" "}{new Date(messages[messages.length - 1]?.timestamp?.toDate()).toUTCString().slice(0, 26)}</p>}
                    
                </div>
                <div className="chat_headerRight" onClick={handleLargeImage}>
                    <IconButton onClick={openSidebar} className="slide_button">
                        {sidebar ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
            </div>

            {largeImage?<div className="largeimageContainer"><CloseIcon className="closeIcon" onClick={handleLargeImage}/><img className="largeImage" src={imageUrl}/></div>:<ReactScrollToBottom className="chat_body" onClick={sidebar && openSidebar}>
                <FlipMove>
                    {messages.map((message, index) => {

                        
                        if(!message.imageUrl){
                            //  <span className="chat_name">{message.name}</span>
                        return <div  className={`chat_message ${message.name === user.displayName && "chat_recevier"}`}><p>{message.message}</p><span className="chat_timestamp"><ReactTimeago date={new Date(message.timestamp?.toDate()).toUTCString()}/></span></div>
                        }
                        // <span className="image_sender">{message.name}</span>
                        return <div onClick={()=>handleImage(message.imageUrl)} className={`image ${message.name === user.displayName && "chat_recevier"}`}><img  src={message.imageUrl} alt="Uploaded Images"/><span className="image_timestamp"><ReactTimeago date={new Date(message.timestamp?.toDate()).toUTCString()}/></span></div> 
                    })}
                </FlipMove>
            </ReactScrollToBottom>}
            
            {!largeImage && <div className="chat_footer">
                {/* <InsertEmoticon/> */}
                <ImageUpload roomId={roomId}/>
                <form >
                    <input value={input} onChange={event => setInput(event.target.value)} type="text" placeholder="Type a message" />
                    <button type="submit" onClick={sendMessage}><SendIcon /></button>
                </form>
                {/* <MicIcon/> */}
            </div>}

        </div>
    )
}

export default Chat;