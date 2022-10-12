import React,{useState , useEffect , useRef } from 'react'
import { getAuth , onAuthStateChanged } from 'firebase/auth';
import { addDoc , collection , serverTimestamp } from 'firebase/firestore';
import {useNavigate} from 'react-router-dom';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '../firebase.config';
import { v4 as uuidv4} from 'uuid';

function CreateLisiting() {

    // geoLocation state because geocoding requries to sign up using credit card 
    const [geolocationEnabled , setGeolocationEnabled] = useState(false);
    // this state to store the data of the form 
    const [formData , setFormData] = useState({
        type : 'rent',
        name : '',
        bedrooms : 1,
        bathrooms : 1,
        parking : false,
        furnished : false,
        location : '',
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
        location ,
        offer ,
        regularPrice ,
        discountedPrice ,
        images ,
        lattitude ,
        longitude ,
    } = formData;

    // const onSubmit = async (e) => {
    //     e.preventDefault();
        
    //     setLoading(true);

    //     // discounted price should not exceed regular price
    //     if(discountedPrice >= regularPrice){
    //         setLoading(false);
    //         toast.error('Discounted price should be less than Regular price');
    //         return ;
    //     }

    //     // can upload only 6 images max
    //     if(images.length > 6){
    //         setLoading(false);
    //         toast.error('can only upload 6 images maximum');
    //         return ;
    //     }

    //     let location ;
    //     let geolocation = {};

    //     geolocation.lat = lattitude;
    //     geolocation.lng = longitude;
    //     location = address;
    //     console.log(geolocation , location);

    //     // store images in firebase storage
    //     const storeImage = async (image) => {
    //         return new Promise((resolve , reject) => {
    //             const storage = getStorage();
    //             const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
    //             const storageRef = ref(storage , 'images/' + fileName);

    //             const uploadTask = uploadBytesResumable(storageRef, image);

    //             uploadTask.on('state_changed', 
    //                 (snapshot) => {
    //                     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //                     console.log('Upload is ' + progress + '% done');
    //                     switch (snapshot.state) {
    //                         case 'paused':
    //                             console.log('Upload is paused');
    //                             break;
    //                         case 'running':
    //                             console.log('Upload is running');
    //                             break;
    //                     }
    //                 }, 
    //                 (error) => {
    //                     // Handle unsuccessful uploads
    //                     reject(error);
    //                 }, 
    //                 () => {
    //                     // Handle successful uploads on complete
    //                     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    //                     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                         resolve(downloadURL);
    //                     });
    //                 }
    //                 );
    //         })
    //     }

    //     const imgUrls = await Promise.all(
    //         [...images].map((image) => {
    //             storeImage(image);
    //         })
    //     ).catch((error) => {
    //         setLoading(false);
    //         toast.error('images not uploaded');
    //     })

    //     console.log(imgUrls);

    //     setLoading(false);
    // }

    // const onSubmit = async (e) => {
    //     e.preventDefault()
    
    //     setLoading(true)
    
    //     if (discountedPrice >= regularPrice) {
    //         setLoading(false)
    //         toast.error('Discounted price needs to be less than regular price')
    //         return
    //     }
    
    //     if (images.length > 6) {
    //         setLoading(false)
    //         toast.error('Max 6 images')
    //         return
    //     }
    
    //     let geolocation = {}
    //     let location ;
        
    //     geolocation.lat = lattitude
    //     geolocation.lng = longitude
        
    
    //     // Store image in firebase
    //     const storeImage = async (image) => {
    //         return new Promise((resolve, reject) => {
    //             const storage = getStorage()
    //             const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
        
    //             const storageRef = ref(storage, 'images/' + fileName)
        
    //             const uploadTask = uploadBytesResumable(storageRef, image)
        
    //             uploadTask.on(
    //             'state_changed',
    //             (snapshot) => {
    //                 const progress =
    //                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //                 console.log('Upload is ' + progress + '% done')
    //                 switch (snapshot.state) {
    //                 case 'paused':
    //                     console.log('Upload is paused')
    //                     break
    //                 case 'running':
    //                     console.log('Upload is running')
    //                     break
    //                 default:
    //                     break
    //                 }
    //             },
    //             (error) => {
    //                 reject(error)
    //             },
    //             () => {
    //                 // Handle successful uploads on complete
    //                 // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    //                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                 resolve(downloadURL)
    //                 })
    //             }
    //             )
    //         })
    //     }
    
    //     const imgUrls = await Promise.all(
    //         [...images].map((image) => storeImage(image))
    //         ).catch(() => {
    //         setLoading(false)
    //         toast.error('Images not uploaded')
    //         return
    //         })

    //         const formDataCopy = {
    //             ...formData,
    //             images : imgUrls,
    //             geolocation,
    //             timeStamp : serverTimestamp(),
    //         }

    //         // delete formDataCopy.images
    //         delete formDataCopy.address
    //         formDataCopy.location = address
    //         !formDataCopy.offer && delete formDataCopy.discountedPrice

    //         const docRef = await addDoc(collection(db , 'listings') , formDataCopy);

    //         setLoading(false);
    //         toast.success('Listing created successfully')
    //         navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    //     }

    const onSubmit = async (e) => {
        e.preventDefault()
    
        setLoading(true)
    
        if (discountedPrice >= regularPrice) {
          setLoading(false)
          toast.error('Discounted price needs to be less than regular price')
          return
        }
    
        if (images.length > 6) {
          setLoading(false)
          toast.error('Max 6 images')
          return
        }
    
        let geoLocation = {}
        
    
        if (geolocationEnabled) {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
          )
    
          const data = await response.json()
    
          geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0
          geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0
    
          location =
            data.status === 'ZERO_RESULTS'
              ? undefined
              : data.results[0]?.formatted_address
    
          if (location === undefined || location.includes('undefined')) {
            setLoading(false)
            toast.error('Please enter a correct address')
            return
          }
        } else {
          geoLocation.lat = lattitude
          geoLocation.lng = longitude
        }
    
        // Store image in firebase
        const storeImage = async (image) => {
          return new Promise((resolve, reject) => {
            const storage = getStorage()
            const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
    
            const storageRef = ref(storage, 'images/' + fileName)
    
            const uploadTask = uploadBytesResumable(storageRef, image)
    
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('Upload is ' + progress + '% done')
                switch (snapshot.state) {
                  case 'paused':
                    console.log('Upload is paused')
                    break
                  case 'running':
                    console.log('Upload is running')
                    break
                  default:
                    break
                }
              },
              (error) => {
                reject(error)
              },
              () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  resolve(downloadURL)
                })
              }
            )
          })
        }
    
        const imageUrls = await Promise.all(
          [...images].map((image) => storeImage(image))
        ).catch(() => {
          setLoading(false)
          toast.error('Images not uploaded')
          return
        })
    
        const formDataCopy = {
          ...formData,
          location,
          imageUrls,
          geoLocation,
          timeStamp: serverTimestamp(),
        }
    
        // formDataCopy.location = address
        delete formDataCopy.images
        // delete formDataCopy.address
        !formDataCopy.offer && delete formDataCopy.discountedPrice
    
        const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
        setLoading(false)
        toast.success('Listing saved')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
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
                    <textarea id="location" type='text' className='formInputAddress' value={location} onChange={onMutate} required />

                    {!geolocationEnabled && 
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