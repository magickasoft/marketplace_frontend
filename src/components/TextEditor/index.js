import React from 'react';
import Quill from 'react-quill';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';


const modules = {
    toolbar: [
        [
            { size: [ ] }
        ],
        [
            'bold',
            'italic',
            'underline',
            'strike'
        ],
        [
            'blockquote'
        ],
        [
            { list: 'ordered' },
            { list: 'bullet' }
        ],
        [
            'link'
        ],
        [
            'clean'
        ]
    ]
};

export default function TextEditor(props) {
    return (
        <Quill
            modules={modules}
            {...props}
        />
    );
}
