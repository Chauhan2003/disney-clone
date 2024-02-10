import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUserName, selectUserPhoto, setSignOutState, setUserLoginDetails } from '../features/user/userSlice';

const Header = (props) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userName = useSelector(selectUserName);
    const userPhoto = useSelector(selectUserPhoto);

    const [isDropDownVisible, setDropDownVisible] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          // Clicked outside the dropdown, close it
          setDropDownVisible(false);
        }
      };
  
      // Add click event listener to the document
      document.addEventListener('click', handleOutsideClick);
  
      return () => {
        // Clean up the event listener when the component unmounts
        document.removeEventListener('click', handleOutsideClick);
      };
    }, []);

    useEffect(
        () => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    setUser(user);
                    navigate('/home');
                }
            })
        }, [userName]
    );

    const handleAuth = () => {
        if (!userName) {
            signInWithPopup(auth, provider).then((result) => {
                setUser(result.user);
            }).catch((error) => {
                alert(error.message);
            })
        }
        else if (userName) {
            auth.signOut().then(() => {
                dispatch(setSignOutState())
                navigate('/');
            }).catch((error) => {
                alert(error.message)
            })
        }
    };

    const setUser = (user) => {
        dispatch(
            setUserLoginDetails({
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
            })
        );
    };

    const handleUserImgClick = () => {
        setDropDownVisible((prevVisible) => !prevVisible);
    };

    return (
        <Nav>
            <Logo>
                <img src='/images/logo.svg' alt='Disney+' />
            </Logo>
            {
                !userName ?
                    (<Login onClick={handleAuth}>Login</Login>)
                    :
                    (<>
                        <NavMenu>
                            <a href='/home'>
                                <img src='/images/home-icon.svg' alt='HOME' />
                                <span>HOME</span>
                            </a>
                            <a href='/search'>
                                <img src='/images/search-icon.svg' alt='HOME' />
                                <span>SEARCH</span>
                            </a>
                            <a href='/watchlist'>
                                <img src='/images/watchlist-icon.svg' alt='HOME' />
                                <span>WATCHLIST</span>
                            </a>
                            <a href='/originals'>
                                <img src='/images/original-icon.svg' alt='HOME' />
                                <span>ORIGINALS</span>
                            </a>
                            <a href='/movies'>
                                <img src='/images/movie-icon.svg' alt='HOME' />
                                <span>MOVIES</span>
                            </a>
                            <a href='/series'>
                                <img src='/images/series-icon.svg' alt='HOME' />
                                <span>SERIES</span>
                            </a>
                        </NavMenu>
                        <SignOut ref={dropdownRef} onClick={handleUserImgClick}>
                            <UserImg src={userPhoto} alt='' />
                            {isDropDownVisible && (
                                <DropDown>
                                    <Name>{userName}</Name>
                                    <Out onClick={handleAuth}>Sign Out</Out>
                                </DropDown>
                            )}
                        </SignOut>
                    </>)
            }
        </Nav>
    )
}

const Nav = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 65px;
    background-color: #090b13;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 36px;
    letter-spacing: 16px;
    z-index: 3;
`;

const Logo = styled.a`
    padding: 0;
    width: 80px;
    margin-top: 4px;
    max-height: 70px;
    font-size: 0;
    display: inline-block;

    img {
        display: block;
        width: 100%;
    }
`;

const NavMenu = styled.div`
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    height: 100%;
    justify-content: flex-end;
    margin: 0px;
    padding: 0px;
    position: relative;
    margin-right: auto;
    margin-left: 25px;

    a {
        display: flex;
        align-items: center;
        padding: 0 12px;
        gap: 5px;
    
        img {
            height: 20px;
            min-width: 20px;
            width: 20px;
            z-index: auto;
        }
    
        span {
            color: rgb(249, 249, 249);
            font-size: 14px;
            letter-spacing: 1.42px;
            line-height: 1.08px;
            padding: 2px 0px;
            white-space: nowrap;
            position: relative;
        
            &:before {
                background-color: rgb(249, 249, 249);
                border-radius: 0px 0px 4px 4px;
                bottom: -10px;
                content: '';
                height: 1px;
                left: 0px;
                opacity: 0;
                position: absolute;
                right: 0px;
                transform-origin: left center;
                transform: scaleX(0);
                transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
                visibility: hidden;
                width: auto;
            }
        }

        &:hover {
            span:before{
                transform: scaleX(1);
                visibility: visible;
                opacity: 1 !important;
            }
        }
    }

    @media (max-width: 1010px) {
        a {
            gap: 2px;
            padding: 0 8px;

            img {
                height: 20px;
                width: 20px;
            }
    
            span {
                font-size: 12px;
            }
        }
    }   
    
    @media (max-width: 840px) {
        display: none;
    }
`;

const Login = styled.a`
    background-color: rgba(0, 0, 0, 0.6);
    padding: 8px 16px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    border: 1px solid #f9f9f9;
    border-radius: 4px;
    transition: all 0.2s ease 0s;

    &:hover {
        background-color: #f9f9f9;
        color: #000;
        cursor: pointer;
        border-color: transparent;
    }
`;

const UserImg = styled.img`
    height: 100%;
`;

const DropDown = styled.div`
    position: absolute;
    top: 30px;
    right: 0;
    background: rgb(19, 19, 19);
    border: 1px solid rgba(151, 151, 151, 0.34);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
    padding: 10px;
    font-size: 14px;
    letter-spacing: 3px;
    width: 200px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Name = styled.span`
    padding: 5px 10px;
`;

const Out = styled.span`
    padding: 10px;
    background-color: #fff;
    color: black;
    border-radius: 4px;
    
    &:hover {
        background-color: #ddd;
    }
`;

const SignOut = styled.div`
    position: relative;
    height: 38px;
    width: 38px;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    text-align: center;

    ${UserImg} {
        border-radius: 50%;
        width: 100%;
        height: 100%;
    }
`;

export default Header
