import React from 'react';
import image from '../assets/images/cat.jpg'; // Путь к вашей картинке

const ImagePage = () => {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <img src={image} alt="Cat" style={{ maxWidth: '25%', maxHeight: '25%' }} />
        </div>
    );
};

export default ImagePage;
