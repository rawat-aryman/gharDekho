import React,{useState} from 'react';
import {toast} from 'react-toastify';
import {Link, useNavigate} from 'react-router-dom';
import {getAuth , createUserWithEmailAndPassword , updateProfile} from 'firebase/auth';
import { setDoc , doc , serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg';
import visbilityIcon from '../assets/svg/visibilityIcon.svg'
import { async } from '@firebase/util';
import GoogleOAuth from '../components/GoogleOAuth';

function SignUp() {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name : '',
        email : '',
        password : '',
    });

    const { name , email , password} = formData;

    const navigate = useNavigate();

    const onChange = (e) => {
        
        setFormData((prev) => ({
            ...prev,
            [e.target.id] : e.target.value,
        }))
    }

    const vis = () => {
        setShowPassword((prev) => !prev);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth()

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )

            const user = userCredential.user

            updateProfile(auth.currentUser, {
                displayName: name,
            })

            //   const formDataCopy = { ...formData }
            //   delete formDataCopy.password
            //   formDataCopy.timestamp = serverTimestamp()

            //   await setDoc(doc(db, 'users', user.uid), formDataCopy)

            const formDataCopy = {...formData};
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, "users", user.uid) , formDataCopy);

            navigate('/')
        } catch (error) {
            toast('something went wrong')
        }
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome Back !!!</p>
                </header>

                <main>
                    <form onSubmit={onSubmit}>
                        <input type="name" className="nameInput" placeholder='Enter Your name' id='name' value={name} onChange = {onChange} />

                        <input type="email" className="emailInput" placeholder='Enter Your Email' id='email' value={email} onChange = {onChange} />

                        <div className="passwordInputDiv">
                            <input type={showPassword ? 'text' : 'password'} className="passwordInput" placeholder='Enter Your Password' id='password' value = {password} onChange={onChange} />

                            <img src={visbilityIcon} className='showPassword' alt="show password" onClick={vis} />
                        </div>
{/* 
                        <Link to='/ForgotPassword' className='forgotPasswordLink'>Forgot password</Link> */}
                    <div className="signUpBar">
                        <p className="signUpText">Sign Up</p>
                        <button className="signUpButton">
                            <ArrowRightIcon fill='#ffffff' height='34px' width='34px' />
                        </button>
                    </div>
                    </form>

                </main>

                <GoogleOAuth/>

                <Link to='/SignIn' className='registerLink'>Sign In Instead</Link>
            </div>
        </>
    )
}

export default SignUp