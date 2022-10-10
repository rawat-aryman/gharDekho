import React from 'react'
import {Link} from 'react-router-dom';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';

function Explore() {
    
    return (
        <div className="explore">
            <header>
                <p className="pageHeader">
                    Explore
                </p>
            </header>

            <main>
                {/* Slider */}
                
                <p className="exploreCategoryHeading">Categories</p>
                <div className="exploreCategories">
                    <Link to='/Category/Rent'>
                        <img src={rentCategoryImage} alt="rent category" className='exploreCategoryImg' />
                        <p className="exploreCategoryName">Places for rent</p>
                    </Link>

                    <Link to='/Category/Sell'>
                        <img src={sellCategoryImage} alt="sell category" className='exploreCategoryImg' />
                        <p className="exploreCategoryName">Places for sale</p>
                    </Link>
                </div>
            </main>
        </div>
    ) 
}

export default Explore