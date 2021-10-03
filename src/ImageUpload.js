import React, {useState,useRef} from 'react';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import ReactLoading from 'react-loading';
import { useStateValue } from './StateProvider';
import firebase from 'firebase';
import db,{storage} from './firebase';
import './ImageUpload.css'
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';




const ImageUpload = ({roomId}) =>{
    const [image,setImage] = useState(null);
    const [progress,setProgress] = useState(0);
    const [{user},dispatch] = useStateValue();
    const [image_src,setSrc] = useState(null)

    const handleChange =(e)=>{
        if(e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/jpg'){
            setImage(e.target.files[0]);
            setSrc(URL.createObjectURL(e.target.files[0]));
        }
        else{
            alert("This is not a image file");
        }
    };

    const handleUpload = (e) =>{
       e.preventDefault();
      console.log(image.type);
       if(!image){
           return
       }
      
    //    console.log(image.name);
      storage.ref(`images/${image.name}`).put(image)
      .on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                alert(error.message);
            },
            ()=>{
                storage
                   .ref('images')
                   .child(image.name)
                   .getDownloadURL()
                   .then(url => {
                       db.collection('rooms').doc(roomId)
                       .collection('messages').add({
                           timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                           imageUrl: url,
                           name: user.displayName,
                       })
                       .then(() => {
                        setImage(null)
                        setProgress(0);
                      })

                    
                    });
                   
            }

        )
    }

    

    const handleclose = () => {
        setImage(null);
    }


    return(
        <div className="upload">
            {!image?<label className="image_input">
                <InsertPhotoIcon/>
            <input type="file" onChange={handleChange}  />
            </label>:
        <div className="preview">
                <CloseIcon className="preview_close" onClick={handleclose}/>
            {progress? <ReactLoading type="balls" color="red" height={50} width={50} className="preview_loading" />:<div className="preview_send">
            <button onClick={handleUpload} className="send_button"><SendIcon /></button>
            <img src={image_src} alt="" className="preview_image"/>
            </div>}
            </div>}
        </div>
    )
     
}

export default ImageUpload;