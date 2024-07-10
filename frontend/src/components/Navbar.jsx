import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
    const [searchQuery, setSearchQuerry] = useState('');
    const navigate = useNavigate();

    const onLogOut = () => {
        localStorage.clear();
        navigate("/login");
    };
    const handleSearch = () => {
        if (searchQuery) {
            onSearchNote(searchQuery);
        }
    };
    const onClearSearch = () => {
        setSearchQuerry('');
        handleClearSearch();
    };

    return (
        <nav>
            <h2 className='logo'>CodeSheet</h2>
            <div className='navSearch'>
                <input
                    type='text'
                    placeholder='Search Notes Here'
                    className=''
                    value={searchQuery}
                    onChange={({ target }) => {
                        setSearchQuerry(target.value);
                    }}
                />
                {searchQuery && (
                    <IoMdClose className='navSearchIcons' onClick={onClearSearch} />
                )}
                <FaMagnifyingGlass className='navSearchIcons' onClick={handleSearch} />
            </div>
            <div className="navUserDetails">
                <p className="">{userInfo?.fullName}</p>
                <button className="" onClick={onLogOut}>Log Out</button>
            </div>
        </nav>
    );
};

export default Navbar;
