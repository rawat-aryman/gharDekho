import React,{useState} from 'react';
import {toast} from 'react-toastify';
import {Link, useNavigate} from 'react-router-dom';
import {getAuth , signInWithEmailAndPassword} from 'firebase/auth';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg';
import visbilityIcon from '../assets/svg/visibilityIcon.svg'
// import { Toast } from 'react-toastify/dist/components';

function SignIn() {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email : '',
        password : ''
    });

    const {email , password} = formData;

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
            const auth = getAuth();

            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            if(userCredential.user){
                navigate('/Profile');
            }
        } catch (error) {
            toast.error("Enter Correct Credentials")
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
                        <input type="email" className="emailInput" placeholder='Enter Your Email' id='email' value={email} onChange = {onChange} />

                        <div className="passwordInputDiv">
                            <input type={showPassword ? 'text' : 'password'} className="passwordInput" placeholder='Enter Your Password' id='password' value = {password} onChange={onChange} />

                            <img src={visbilityIcon} className='showPassword' alt="show password" onClick={vis} />
                        </div>

                        <Link to='/ForgotPassword' className='forgotPasswordLink'>Forgot password</Link>
                        <div className="signInBar">
                            <p className="signInText">Sign In</p>
                            <button className="signInButton">
                                <ArrowRightIcon fill='#ffffff' height='34px' width='34px' />
                            </button>
                        </div>
                    </form>

                </main>

                {/* Google OAuth */}

                <Link to='/SignUp' className='registerLink'>Sign Up Instead</Link>
            </div>
        </>
    )
}

export default SignIn