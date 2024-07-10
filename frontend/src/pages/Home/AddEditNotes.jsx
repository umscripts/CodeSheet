import React, { useState } from 'react';
import TagInput from '../../components/input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
    const [title, setTitle] = useState(noteData?.title || '');
    const [content, setContent] = useState(noteData?.content || '');
    const [tags, setTags] = useState(noteData?.tags || '');
    const [error, setError] = useState(null);
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post('/add-note', {
                title,
                content,
                tags
            });
            if (response.data && response.data.note) {
                showToastMessage('Note Added Successfully');
                getAllNotes();
                onClose();
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
            }
        }
    };
    const editNote = async () => {
        const noteId = noteData._id;
        try {
            const response = await axiosInstance.put('/edit-note/' + noteId, {
                title,
                content,
                tags
            });
            if (response.data && response.data.note) {
                showToastMessage('Note Updated Successfully');
                getAllNotes();
                onClose();
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
            }
        }
    };
    const handleAddNote = () => {
        if (!title) {
            setError("Please Enter Title");
            return;
        }
        if (!content) {
            setError("Please Enter Content");
            return;
        }
        setError("");
        if (type === 'edit') {
            editNote();
        } else {
            addNewNote();
        }
    };
    return (
        <div className='modal'>
            <MdClose className='closModal' onClick={onClose} />
            <br />
            <div className="modalInputs">
                <div className="modalTitle">
                    <label className="input-label">Title</label>
                    <input
                        type="text"
                        className='text-2xl text-slate-950 outline-none'
                        placeholder='Enter Title Here'
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div className="modalContent">
                    <label className="input-label">Content</label>
                    <textarea
                        type='text'
                        className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                        placeholder='Enter Content Here'
                        rows={10}
                        value={content}
                        onChange={({ target }) => setContent(target.value)}
                    />
                </div>
                {error && <p className=''>{error}</p>}
                <button className='modalBtn' onClick={handleAddNote}>
                    {type === 'edit' ? 'UPDATE' : 'ADD'}
                </button>
            </div>
        </div>
    );
};

export default AddEditNotes;
