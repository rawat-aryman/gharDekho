import React,{useState , useEffect , useRef } from 'react'
import { getAuth , onAuthStateChanged } from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import Spinner from '../components/Spinner';



function CreateLisiting() {

    // geoLocation state because geocoding requries to sign up using credit card 
    const [geoLocationEnabled , setGeoLocationEnabled] = useState(true);
    // this state to store the data of the form 
    const [formData , setFormData] = useState({
        type : 'rent',
        name : '',
        bedrooms : 1,
        bathrooms : 1,
        parking : false,
        furnished : false,
        address : '',
        offer : false,
        regularPrice : 0,
        discountedPrice : 0,
        images : {},
        lattitude : 0,
        longitude : 0,

    })
    // this state to show spinner when the user submits the form with all details
    const [loading , setLoading ] = useState(false);

    const auth = getAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);

    // here we simply see wether the user is logged in or not , if not we simply redirect it to sign in / sign up first
    useEffect(() => {
        if(isMounted){
            onAuthStateChanged(auth , (user) => {
                if(user){
                    setFormData({
                        ...formData ,
                        userRef : user.uid,
                    })
                }
                else{
                    navigate('/SignIn');
                }
            })
        }

        return () => {
            isMounted.current = false;
        }
    } , [isMounted])


    const {
        type ,
        name ,
        bedrooms ,
        bathrooms ,
        parking ,
        furnished ,
        address ,
        offer ,
        regularPrice ,
        discountedPrice ,
        images ,
        lattitude ,
        longitude ,
    } = formData;

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    const onMutate = (e) => {
        let boolean = null;

        if(e.target.value === 'true'){
            boolean = true;
        }
        if(e.target.value === 'false'){
            boolean = false;
        }

        //for files
        if(e.target.files){
            setFormData((prevState) => ({
                ...prevState,
                images : e.target.files,
            }) )
        }

        else{
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id] : boolean ?? e.target.value,
            }))
        }
    }

    if(loading){
        return <Spinner />
    }

    return (
        <div className="profile">
            <header>
                <p className="pageHeader">
                    Create Listing
                </p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <label className='formLabel'> Sell / Rent</label>
                    <div className="formButtons">
                        <button type = 'button' className={type === 'sale' ? 'formButtonActive' : 'formButton'} id='type' value='sale' onClick={onMutate} >
                            Sell
                        </button>
                        <button type = 'button' className={type === 'rent' ? 'formButtonActive' : 'formButton'} id='type' value='rent' onClick={onMutate} >
                            Rent
                        </button>
                    </div>

                    <label className='formLabel'>Name</label>
                    <input type="text" className='formInputName' id='name' value={name} onChange={onMutate} maxLength='32' minLength='10' required />

                    <div className="formRooms flex">
                        <div>
                            <label className='formLabel'>Bedrooms</label>
                            <input type="number" id="bedrooms" className='formInputSmall' value={bedrooms} onChange={onMutate} min='1' max='50' required />
                        </div>
                        <div>
                            <label className='formLabel'>Bathrooms</label>
                            <input type="number" id="bathrooms" className='formInputSmall' value={bathrooms} onChange={onMutate} min='1' max='50' required />
                        </div>
                    </div>

                    <label className='formLabel'>Parking Spot</label>
                    <div className="formButtons">
                        <button className={parking ? 'formButtonActive' : 'formButton'} id='parking' type='button' value={true} onClick={onMutate} min='1' max='50'>
                            Yes
                        </button>
                        <button className={!parking && parking !== null ? 'formButtonActive' : 'formButton'} type='button' value={false} onClick={onMutate} min='1' max='50'>
                            No
                        </button>
                    </div>

                    <label className='formLabel'>Furnished</label>
                    <div className="formButtons">
                        <button className={furnished ? 'formButtonActive' : 'formButton'} id='furnished' type='button' value={true} onClick={onMutate} min='1' max='50'>
                            Yes
                        </button>
                        <button className={!furnished && furnished !== null ? 'formButtonActive' : 'formButton'} type='button' value={false} onClick={onMutate} min='1' max='50'>
                            No
                        </button>
                    </div>

                    <label className='formLabel'>Address</label>
                    <textarea id="address" type='text' className='formInputAddress' value={address} onChange={onMutate} required />

                    {!geoLocationEnabled && 
                        <div className="formLatLng flex">
                            <div>
                                <label className="formLabel">Lattitude</label>
                                <input type="number" id='lattitude' onChange={onMutate} className='formInputSmall' value={lattitude} required/>
                            </div>
                            <div>
                                <label className="formLabel">Longitude</label>
                                <input type="number" id='longitude' onChange={onMutate} className='formInputSmall' value={longitude} required/>
                            </div>
                        </div>
                    }

                    <label className='formLabel'>Offer</label>
                    <div className='formButtons'>
                        <button id='offer' value={true} onClick={onMutate} className={offer ? 'formButtonActive' : 'formButton'} type='button'>Yes</button>
                        <button id='offer' value={false} onClick={onMutate} className={ !offer && offer !== null ? 'formButtonActive' : 'formButton'} type='button'>No</button>
                    </div>

                    <label className="formLabel">Regular Price</label>
                    <div className="formPriceDiv">
                        <input type="number" className='formInputSmall' id='regularPrice' value={regularPrice} onChange={onMutate} min='50' max='750000000' required />
                        {type === 'rent' && (
                            <p className="formPriceText">$ / Month</p>
                        )}
                    </div>

                    {offer && (
                        <>
                            <label className="formLabel">Discounted Price</label>
                            <div className="formPriceDiv">
                                <input type="number" className='formInputSmall' id='discountedPrice' value={discountedPrice} onChange={onMutate} min='50' max='750000000' required={offer} />
                            </div>
                        </>
                    )}

                    <label className='formLabel'>Images</label>
                    <p className="imagesInfo">The first image will be the cover (max 6).</p>
                    <input type="file" id='images' onChange={onMutate} max='6' accept='.jpg,.png,.jpeg' multiple required className="formInputFile" />

                    <button type='submit' className="primaryButton createListingButton">
                        Create listing
                    </button>
                </form>
            </main>
        </div>
    )
}

export default CreateLisiting