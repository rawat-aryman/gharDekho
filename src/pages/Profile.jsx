import React,{useState, useEffect} from 'react'
// import SignIn from './SignIn'
import {getAuth} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Profile() {

    
    const [user, setUser] = useState(null);
    const auth = getAuth();
    const navigate = useNavigate();
    
    if(auth.currentUser === null){
        navigate('/SignIn');
    }
}

export default Profile