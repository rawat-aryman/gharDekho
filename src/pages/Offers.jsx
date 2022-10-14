import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Offers() {

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing , setLastFetchedListing] = useState(null);


    const params = useParams();

    useEffect(() => {
        const fetchListings = async () => {
        try {
        // Get reference
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(
            listingsRef,
            where('offer', '==', true),
            orderBy('timeStamp', 'desc'),
            limit(10)
        )

        // Execute query
        const querySnap = await getDocs(q);
        const lastFetched = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastFetched);

        const listings = []

        querySnap.forEach((doc) => {
            return listings.push({
                id: doc.id,
                data: doc.data(),
            })
        })

        // console.log(listings);

        setListings(listings)
        setLoading(false)
        } catch (error) {
        toast.error('Could not fetch listings')
        }
    }
    
        fetchListings()
    }, [])

    const onfetchMoreListings = async () => {
        try {
        // Get reference
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(
            listingsRef,
            where('offer', '==', true),
            orderBy('timeStamp', 'desc'),
            startAfter(lastFetched),
            limit(10)
        )

        // Execute query
        const querySnap = await getDocs(q);

        const lastFetched = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastFetched);

        const listings = []

        querySnap.forEach((doc) => {
            return listings.push({
                id: doc.id,
                data: doc.data(),
            })
        })

        // console.log(listings);

        setListings((prevState) => [...prevState , ...listings])
        setLoading(false)
        } catch (error) {
        toast.error('Could not fetch listings')
        }
    }


    return <div className="category">
        <header>
            <p className="pageHeader">
                {/* {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'} */}
                Offers
            </p>
        </header>

        {loading ? <Spinner/> : (listings.length > 0 ? <>
            <main>
                {listings.map((listing) => {
                    return <ListingItem 
                                listing={listing.data} 
                                id={listing.id} 
                                key={listing.id} 
                            />
                })}
            </main>

            <br /><br />
            {lastFetchedListing && (
                <p className="loadMore" onClick={onfetchMoreListings} >Load More</p>
            )}
        </> : 'no data')}
    </div>
    
}

export default Offers