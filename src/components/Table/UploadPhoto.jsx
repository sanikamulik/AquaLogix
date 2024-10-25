import React, { useState } from 'react';
import axios from 'axios';

const UploadPhoto = ({ portId }) => {
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault(); // Prevent default button behavior

    if (!photo) {
      alert('Please select a photo to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', photo);

    try {
      const response = await axios.post(`http://localhost:5000/upload-photo/${portId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error uploading photo:', error);
      // Alert user to the error
      alert(`Error uploading photo: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <div>
      <input type="file" onChange={handlePhotoChange} />
      <button onClick={handleUpload}>Upload Photo</button>
    </div>
  );
};

export default UploadPhoto;
