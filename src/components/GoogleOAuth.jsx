import React from 'react'
import {useNavigate , useLocation} from 'react-router-dom';
import {getAuth , signInWithPopup , GoogleAuthProvider} from 'firebase/auth';
import {doc, setDoc , getDoc , serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';
import { async } from '@firebase/util';

function GoogleOAuth() {
    const navigate = useNavigate();
    const location = useLocation();

    const onClick = async () => {

        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth , provider);
            const user = result.user;

            // check whether the user is present in the database or not
            const docRef = doc(db , 'users' , user.uid);
            const docSnap = await getDoc(docRef);

            // adding a user
            if(!docSnap.exists()){
                await setDoc(doc(db,'users',user.uid) , {
                    name : user.displayName,
                    email : user.email,
                    timestamp : serverTimestamp(),
                })
            }

            navigate('/');

        } catch (error) {
            toast.error('could not authenticate with google');
        }

    };

    return <div className="socialLogin">
        <p>Sign {location.pathname === '/SignIn' ? 'in' : 'up'} with</p>
        <button className="socialIconDiv" onClick={onClick}>
            <img className='socialIconImg' src={googleIcon} alt="google icon" />
        </button>
    </div>
}

export default GoogleOAuth