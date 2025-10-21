import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { compressImage, getStorageUsage } from '../../utils/imageUtils';
import './LoginModal.css';

const LoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, registerUser, loginUser, users } = useUser();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should not exceed 5MB');
        return;
      }

      try {
        // Check storage usage before processing
        const usage = getStorageUsage();
        if (parseFloat(usage.usagePercent) > 90) {
          setError(`Storage is almost full (${usage.usagePercent}% used). Please clear some data.`);
          return;
        }

        // Compress image to reduce storage usage
        const compressedImage = await compressImage(file, 150, 150, 0.7);
        setFormData(prev => ({
          ...prev,
          avatar: compressedImage
        }));
        setAvatarPreview(compressedImage);
        setError('');
      } catch (error) {
        console.error('Error processing image:', error);
        setError('Failed to process image. Please try a different file.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      // Registration
      if (!formData.name.trim()) {
        setError('Please enter username');
        return;
      }
      if (!formData.email.trim()) {
        setError('Please enter email');
        return;
      }

      if (!isValidEmail(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      // Check for duplicate email
      if (users.some(user => user.email.toLowerCase() === formData.email.toLowerCase())) {
        setError('User with this email already exists');
        return;
      }
      
      // Check for duplicate username
      if (users.some(user => user.name.toLowerCase() === formData.name.trim().toLowerCase())) {
        setError('Username is already taken');
        return;
      }

      registerUser(formData);
    } else {
      // Login
      if (!formData.email.trim()) {
        setError('Please enter email');
        return;
      }

      if (!isValidEmail(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      const user = loginUser(formData.email);
      if (!user) {
        setError('User with this email not found');
        return;
      }
    }
  };

  const closeModal = () => {
    setIsLoginModalOpen(false);
    setFormData({ name: '', email: '', avatar: null });
    setAvatarPreview(null);
    setError('');
    setIsRegistering(false);
  };

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setFormData({ name: '', email: '', avatar: null });
    setAvatarPreview(null);
  };

  return (
    <div className="login-modal-overlay" onClick={closeModal}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={closeModal}>×</button>
        
        <div className="login-modal-header">
          <h2>{isRegistering ? 'Sign Up' : 'Sign In'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {isRegistering && (
            <>
              <div className="form-group">
                <label htmlFor="name">Username</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  maxLength={20}
                />
              </div>

              <div className="form-group avatar-group">
                <label htmlFor="avatar">Avatar (optional)</label>
                <div className="avatar-upload">
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="avatar-input"
                  />
                  <label htmlFor="avatar" className="avatar-upload-label">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" className="avatar-preview" />
                    ) : (
                      <div className="avatar-placeholder">
                        <span>+</span>
                        <p>Upload photo</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button">
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="switch-mode">
          <p>
            {isRegistering ? 'Already have an account?' : 'Don\'t have an account?'}
            <button type="button" onClick={switchMode} className="switch-button">
              {isRegistering ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;