import React, { useState , useEffect } from 'react';
import {Link , useNavigate , useParams} from 'react-router-dom';
import { getDoc , doc } from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {db} from '../firebase.config';
import {MapContainer , Popup , TileLayer , Marker } from 'react-leaflet';
import SwiperCore , {Navigation , Pagination, Scrollbar, A11y} from 'swiper';
import {Swiper , SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
SwiperCore.use([Navigation , Pagination, Scrollbar, A11y]);

function Listing() {

    const [listing , setLisitng] = useState(null);
    const [loading , setLoading] = useState(true);
    const [shareLinkCopied , setShareLinkCopied] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db , 'listings' , params.id);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                // console.log(docSnap.data());
                setLisitng(docSnap.data());
                setLoading(false);
            }
        }

        fetchListing();
    } , [navigate , params.id]);

    if(loading){
        return <Spinner />
    }

    return (
        <>
            <main>
                
                <Swiper slidesPerView={1} pagination={{clickable:true}}>
                    {listing.imageUrls.map((url , index) => (
                        <SwiperSlide key={index}>
                            <div style={{background : `url(${listing.imageUrls[index]}) center no-repeat`, backgroundSize: 'cover'}} className="swiperSlideDiv">

                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="shareIconDiv" onClick={() =>{
                    navigator.clipboard.writeText(window.location.href);
                    setShareLinkCopied(true);
                    setTimeout(() =>{
                        setShareLinkCopied(false);
                    } , 2000)
                }}>
                    <img src={shareIcon} alt="share icon" />
                </div>
                {shareLinkCopied && <p className='linkCopied'>Link Copied!  </p>}

                <div className="listingDetails">
                    <p className="listingName">{listing.name} - ${listing.offer ? listing.discountedPrice : listing.regualerPrice}</p>
                    <p className="listingLocation">{listing.location}</p>
                    <p className="listingType">
                        For {listing.type === 'rent' ? 'Rent' : 'Sale'}
                    </p>
                    {listing.offer && (
                        <p className="discountPrice">
                            ${listing.regularPrice - listing.discountedPrice} discount
                        </p>
                    )}

                    <ul className="listingDetailsList">
                        <li>
                            {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : `${listing.bedrooms} Bedroom`}
                        </li>
                        <li>
                            {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : `${listing.bathrooms} Bathroom`}
                        </li>
                        <li>
                            {listing.parking ? 'Parking Spot Available' : 'No parking spot available'}
                        </li>
                        <li>
                            {listing.furnished ? 'Fully furnished' : 'Not furnished'}
                        </li>
                    </ul>

                    <p className="listingLocationTitle">Location</p>
                        
                    <div className="leafletContainer">
                        <MapContainer style={{height: '100%' , width : '100%'}} center={[listing.geoLocation.lat , listing.geoLocation.lng]} zoom={13} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                            />

                            <Marker position={[listing.geoLocation.lat , listing.geoLocation.lng]}>
                                <Popup>{listing.location}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {auth.currentUser?.uid !== listing.userRef && (
                        <Link to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`} className='primaryButton'>Contact Landlord</Link>
                    )}
                </div>
            </main>
        </>
    )
}

export default Listing