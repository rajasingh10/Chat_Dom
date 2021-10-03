import React,{useEffect,useState} from 'react';
import './Sidebar.css'
import { Avatar, IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from './SidebarChat';
import db,{auth} from './firebase';
import { useStateValue } from "./StateProvider";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';



const Sidebar = ({sidebar,closeSidebar}) =>{
    const [rooms,setRooms] = useState([]);
    const [{user},dispatch] = useStateValue();
    

    useEffect(() => {
     const unsubscribe = db.collection('rooms').onSnapshot(snapshot => (
          setRooms(snapshot.docs.map(doc => ({id: doc.id,
        data: doc.data(),})))
      )) 

      return () => {
          unsubscribe();
      }
    }, []);
    

    const handleLogout= ()=>{
     auth.signOut();
    }
    return(
        <div  onClick={closeSidebar} className={`sidebar ${sidebar && 'visible'}`}>

            <div className="sidebar_header">
                <div className="sidebar_headerLeft">
            <IconButton>
             <Avatar src={user?.photoURL}/>
             </IconButton>
             <h3>{user.displayName}</h3>
                </div>
             <div className="sidebar_headerRight">
                 {/* <IconButton>
                 <DonutLargeIcon/>
                 </IconButton>
                 <IconButton>
                 <ChatIcon/>
                 </IconButton>
                 <IconButton>
                 <MoreVertIcon/>
                 </IconButton> */}

                  <IconButton onClick={handleLogout}>
                 <ExitToAppIcon/> <h6>Log out</h6>
                 </IconButton>
             </div>
            </div>


            {/* <div className="sidebar_search">
                <div className="sidebar_searchContainer">
             <SearchOutlined/>
             <input placeholder="search msg"/>
                </div>
            </div> */}

 
            <div className="sidebar_chats">
            <SidebarChat addNewChat/>
            {/* {console.log(rooms)} */}
            {rooms.map(room => {
                if((room.data.users[0] === user.email) || (room.data.users[1] === user.email)){
                    return  <SidebarChat key={room.id} id={room.id} users={room.data.users}/>
                }
})}
            </div>
        </div>
    )
} 

export default Sidebar