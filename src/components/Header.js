import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { selectUserName, selectUserPhoto, setUserLogin, setSignOut } from "../features/user/userSlice";
import { auth, provider } from "../firebase";

function Header() {
    const userName = useSelector(selectUserName);
    const userPhoto = useSelector(selectUserPhoto);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                dispatch(setUserLogin({
                    name: user?.displayName, email: user?.email, photo: user?.photoURL
                }));
                history.push("/");
            } else {
                history.push("/login");
            }
        });
    }, [])

    const signIn = () => {
        auth.signInWithPopup(provider).then(result => {
            let user = result?.user;
            dispatch(setUserLogin({
                name: user?.displayName, email: user?.email, photo: user?.photoURL
            }));
            history.push("/");
        });
    };

    const signOut = () => {
        auth.signOut().then(() => {
            dispatch(setSignOut());
            history.push("/login");
        });
    }

    return (
        <Nav>
            <Logo src="/images/logo.svg" alt="logo" />
            {userName ? (
                <NavMenu>
                    <a href="#">
                        <img src="/images/home-icon.svg" alt="home" />
                        <span>HOME</span>
                    </a>
                    <a href="#">
                        <img src="/images/search-icon.svg" alt="search" />
                        <span>SEARCH</span>
                    </a>
                    <a href="#">
                        <img src="/images/watchlist-icon.svg" alt="watchlist" />
                        <span>WATCHLIST</span>
                    </a>
                    <a href="#">
                        <img src="/images/original-icon.svg" alt="original" />
                        <span>ORIGINAL</span>
                    </a>
                    <a href="#">
                        <img src="/images/movie-icon.svg" alt="movies" />
                        <span>MOVIES</span>
                    </a>
                    <a href="#">
                        <img src="/images/series-icon.svg" alt="series" />
                        <span>SERIES</span>
                    </a>
                </NavMenu>
            ) : (
                <LoginContainer>
                    <LoginButton onClick={signIn}>Login</LoginButton>
                </LoginContainer>
            )}
            {userPhoto && <UserImage onClick={signOut} src={userPhoto || "/images/logo.svg"} alt="userImage" />}
        </Nav>
    )
}

export default Header

const Nav = styled.div`
    height: 70px;
    background-color: #090b13;
    display: flex;
    align-items: center;
    padding: 0 36px;
    overflow-x: hidden;
`
const Logo = styled.img`
    width: 80px;
`
const NavMenu = styled.div`
    display: flex;
    flex: 1;
    margin-left: 25px;
    align-items: center;
    a {
        display: flex;
        color: white;
        align-items: center;
        padding: 0 12px;
        cursor: pointer;
        text-decoration: none;
        img {
            height: 20px;
        }
        span {
            font-size: 13px;
            letter-spacing: 1.42px;
            position: relative;
            &:after {
                content: "";
                height: 2px;
                background: white;
                position: absolute;
                left: 0;
                right: 0;
                bottom: -6px;
                opacity: 0;
                transform-origin: left center;
                transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
                transform: scaleX(0);
            }
        }
        &:hover {
            span:after {
                opacity: 1;
                transform: scaleX(1);
            }
        }
    }
`
const UserImage = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    cursor: pointer;
`
const LoginContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-end;
`
const LoginButton = styled.div`
    border: 1px solid #f9f9f9;
    padding: 8px 16px;
    border-radius: 4px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    background-color: rgba(0, 0, 0, 0.6);
    transition: all 0.2s ease 0s;
    cursor: pointer;
    &:hover {
        background-color: #f9f9f9;
        color: #000000;
        border-color: transparent;
    }
`