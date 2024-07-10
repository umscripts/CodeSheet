import React, { useEffect } from 'react';
import { LuCheck } from 'react-icons/lu';
import { MdDeleteOutline } from 'react-icons/md';

const Toast = ({ isShown, message, type, onClose }) => {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onClose();
        }, 3000);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [onClose]);
    return (
        <div className={` toastBox ${isShown ? 'toastShown' : 'toastHide'}`}>
            <div className={`toastInner ${type === 'delete' ? 'toastRed' : 'toastGreen'}`}>
                <div className="toastMostInner">
                    <div className={`toastIcon ${type === 'delete' ? 'toastRed' : 'toastGreen'}`}>
                        {type === 'delete' ? (<MdDeleteOutline className='toastIconInnerRed' />) : (<LuCheck className='toastIconInnerGreen' />)}
                    </div>
                    <p className="toastMsg">{message}</p>
                </div>
            </div >
        </div>
    );
};

export default Toast;
