import React from 'react';

const EmptyCard = ({ imgSrc, message }) => {
    return (
        <div className='imgContainer'>
            <img src={imgSrc} alt="No notes" className='emptyImg' />
            <p className="">{message}</p>
        </div>
    );
};
export default EmptyCard;
