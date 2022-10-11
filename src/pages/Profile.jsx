import React,{useState, useEffect} from 'react'
// import SignIn from './SignIn'
import {getAuth , updateProfile} from 'firebase/auth';
import {updateDoc , doc} from 'firebase/firestore';
import {db} from '../firebase.config';
import { useNavigate , Link } from 'react-router-dom';
import {toast} from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

function Profile() {
    const auth = getAuth();
    const [formData, setFormData] = useState({
        name : auth.currentUser.displayName,
        email : auth.currentUser.email,
    });
    const [updateDetails, setUpdateDetails] = useState(false);
    const {name , email} = formData;
    const navigate = useNavigate();

    const onLogout = () => {
        auth.signOut();
        navigate('/SignIn')
    }

    const onsubmit = async (e) => {
        // e.preventDefault();

        try {
            const auth = getAuth();

            if(auth.currentUser.displayName !== name){
                // update display name in fb
                await updateProfile(auth.currentUser , {
                    displayName : name
                })

                // update in firestore

                const userRef = doc(db , 'users' , auth.currentUser.uid);
                await updateDoc(userRef, {
                    name
                })
            }

        } catch (error) {
            toast.error('something went wrong')
        }
    }

    const onClick = () => {
        updateDetails && onsubmit();
        setUpdateDetails((prev) => !prev);
    }

    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id] : e.target.value,
        }))
    }

    return <>
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button type='button' className="logOut" onClick={onLogout}>
                    Logout
                </button>
            </header>

            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailstext">
                        Personal Details
                    </p>
                    <p className="changePersonalDetails" onClick={onClick}>
                        {updateDetails ? 'done' : 'update'}
                    </p>
                </div>

                <div className="profileCard">
                    <form>
                        <input type="text" id='name' className={updateDetails ? 'profileNameActive' : 'profileName'} value = {name} disabled={!updateDetails} onChange={onChange} />

                        <input type="email" id='email' className='profileEmail' value = {email} disabled = {true} onChange={onChange} />
                    </form>
                </div>

                <Link to='/CreateListing' className='createListing'>
                    <img src={homeIcon} alt="home" />
                    <p>Sell or Rent your home</p>
                    <img src={arrowRight} alt="arrow" />
                </Link>

            </main>
        </div>
    </>
}

export default Profile