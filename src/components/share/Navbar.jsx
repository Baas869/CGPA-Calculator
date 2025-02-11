import { useNavigate, useLocation } from 'react-router-dom'
import {ReactComponent as OfferIcon} from '../../assets/svg/localOfferIcon.svg'
import {ReactComponent as ExplorIcon} from '../../assets/svg/exploreIcon.svg'
import {ReactComponent as PersonOutLineIcon} from '../../assets/svg/personOutlineIcon.svg'
import React from 'react'

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const pathMatchRoute = ( route) => {
        if(route === location.pathname){
            return true
        }
    }
  return (
    <footer className='navbar'>
        <nav className="navbarNav">
            <ul className="navbarListItems">
                <li className="navbarListItem" onClick={() => navigate('/')}>
                    <ExplorIcon fill={pathMatchRoute('/') ? '#00cc66' : '#8f8f8f'}
                        width='36px' 
                        height='36px' />
                    <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Explore</p>
                </li>
                <li className="navbarListItem" onClick={() => navigate('/offer')}>
                    <OfferIcon fill={pathMatchRoute('/offer') ? '#00cc66' : '#8f8f8f'} 
                        width='36px' 
                        height='36px' />
                    <p className={pathMatchRoute('/offer') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Offer</p>
                </li>
                <li className="navbarListItem" onClick={() => navigate('/login')}>
                    <PersonOutLineIcon fill={pathMatchRoute('/login') ? '#00cc66' : '#8f8f8f'} 
                        width='36px' 
                        height='36px' />
                    <p className={pathMatchRoute('/login') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Profile</p>
                </li>
            </ul>
        </nav>
    </footer>
  )
}

export default Navbar