import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Importing the dark theme
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdOutlinePushPin, MdCreate, MdDelete, MdContentCopy } from 'react-icons/md';

const NoteCard = ({ title, content, onEdit, onDelete, onPinNote }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        Prism.highlightAll();
    }, [content]);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000); // Reset "Copied" text after 2 seconds
    };

    return (
        <div className='snippet'>
            <div className='snippetHead'>
                <h3>{title}</h3>
                <div className="snippetIcons">
                    <MdOutlinePushPin className='snippetPin' onClick={onPinNote} />
                    <MdCreate className='snippetEdit' onClick={onEdit} />
                    <MdDelete className='snippetDelete' onClick={onDelete} />
                </div>
            </div>
            <div className="code-container">
                <pre className="language-javascript">
                    <code className="language-javascript">{content}</code>
                </pre>
                <CopyToClipboard text={content} onCopy={handleCopy}>
                    <button className="copy-button">
                        {copied ? 'Copied' : <MdContentCopy />}
                    </button>
                </CopyToClipboard>
            </div>
        </div>
    );
};

export default NoteCard;
