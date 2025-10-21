import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { compressImage, getStorageUsage } from '../../utils/imageUtils';
import './Header.css';

const Header = ({ onFaqToggle, onLeaderboardToggle, currentView, onViewChange, isRouletteSpinning }) => {
  const { currentUser, setIsLoginModalOpen, logoutUser, updateUserProfile, users } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState(null);
  const [editError, setEditError] = useState('');

  const handleLoginClick = () => {
    if (!isRouletteSpinning) {
      setIsLoginModalOpen(true);
    }
  };

  const handleUserMenuToggle = () => {
    if (!isRouletteSpinning) {
      setShowUserMenu(!showUserMenu);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setShowUserMenu(false);
  };

  const handleFaqClick = () => {
    if (!isRouletteSpinning) {
      onFaqToggle(true);
    }
  };

  const handleLeaderboardClick = () => {
    if (!isRouletteSpinning) {
      onLeaderboardToggle();
    }
  };

  const handleEditClick = () => {
    setEditName(currentUser.name);
    setEditAvatar(null); // Reset temporary avatar
    setEditError('');
    setIsEditing(true);
    setShowUserMenu(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setEditError('File size should not exceed 5MB');
        return;
      }

      try {
        // Check storage usage before processing
        const usage = getStorageUsage();
        if (parseFloat(usage.usagePercent) > 90) {
          setEditError(`Storage is almost full (${usage.usagePercent}% used). Please clear some data.`);
          return;
        }

        // Compress image and store temporarily
        const compressedImage = await compressImage(file, 150, 150, 0.7);
        setEditAvatar(compressedImage);
        setEditError('');
      } catch (error) {
        console.error('Error processing image:', error);
        setEditError('Failed to process image. Please try a different file.');
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName('');
    setEditAvatar(null);
    setEditError('');
  };

  const handleNameChange = (e) => {
    setEditName(e.target.value);
    setEditError('');
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();

    if (!editName.trim()) {
      setEditError('Please enter username');
      return;
    }

    // Check for duplicate username (excluding current user)
    if (users.some(user => user.id !== currentUser.id && user.name.toLowerCase() === editName.trim().toLowerCase())) {
      setEditError('Username is already taken');
      return;
    }

    try {
      const updates = {};
      let hasChanges = false;

      // Check name changes
      if (editName.trim() !== currentUser.name) {
        updates.name = editName.trim();
        hasChanges = true;
      }

      // Check avatar changes
      if (editAvatar) {
        updates.avatar = editAvatar;
        hasChanges = true;
      }

      // Show message if nothing changed
      if (!hasChanges) {
        setEditError('No changes to save');
        return;
      }

      // Save all changes simultaneously
      updateUserProfile(updates);

      // Close modal window
      setIsEditing(false);
      setEditName('');
      setEditAvatar(null);
      setEditError('');
    } catch (error) {
      console.error('Error saving changes:', error);
      setEditError('Failed to save changes. Please try again.');
    }
  };

  return (
    <div>
      <header className="header px-3 md:px-6">
        <div className="header-left gap-3 md:gap-10">
          <div className="logo gap-2">
            <img src="/Skylar.png" alt="SKYLAR" className="logo-icon w-10 h-10 md:w-[75px] md:h-[75px]" />
            <span className="logo-text hidden md:inline text-white font-bold">SKYLAR</span>
          </div>
          <nav className="nav overflow-x-auto md:overflow-visible gap-3 md:gap-5">
            <button
              className={`nav-item text-sm md:text-base whitespace-nowrap ${currentView === 'roulette' ? 'active' : ''} ${isRouletteSpinning ? 'disabled' : ''}`}
              onClick={() => onViewChange('roulette')}
              disabled={isRouletteSpinning}
            >
              💎 Open Case
            </button>
            <button
              className={`nav-item text-sm md:text-base whitespace-nowrap ${currentView === 'leaderboard' ? 'active' : ''} ${isRouletteSpinning ? 'disabled' : ''}`}
              onClick={handleLeaderboardClick}
              disabled={isRouletteSpinning}
            >
              🏆 Leaderboard
            </button>
            <button
              className={`nav-item coming-soon-btn hidden md:inline-block ${isRouletteSpinning ? 'disabled' : ''}`}
              disabled={isRouletteSpinning}
            >
              🚀 Coming soon...
            </button>
          </nav>
        </div>

        <div className="header-right gap-3 md:gap-5">
          <button
            className={`help-btn text-sm md:text-base ${isRouletteSpinning ? 'disabled' : ''}`}
            onClick={handleFaqClick}
            disabled={isRouletteSpinning}
          >
            <span className="w-5 h-5 md:w-5 md:h-5 flex items-center justify-center">?</span>
            FAQ
          </button>
          <div className="balance px-2 py-1 md:px-4 md:py-2 text-sm md:text-base">
            <img src="/Money.png" alt="Money" className="money-icon w-4 h-4 md:w-5 md:h-5" />
            <span className="whitespace-nowrap">{currentUser ? currentUser.balance.toFixed(1) : '0.0'}</span>
          </div>

          {currentUser ? (
            <div className="user-profile">
              <button
                className={`profile-btn ${isRouletteSpinning ? 'disabled' : ''}`}
                onClick={handleUserMenuToggle}
                disabled={isRouletteSpinning}
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" className="profile-avatar w-7 h-7 md:w-10 md:h-10" />
                ) : (
                  <div className="profile-avatar-placeholder w-7 h-7 md:w-10 md:h-10">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="profile-name hidden md:inline">{currentUser.name}</span>
              </button>

              {showUserMenu && (
                <div className="user-menu">
                  <div className="user-menu-buttons">
                    <button className="user-menu-btn logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                    <button className="user-menu-btn edit-btn" onClick={handleEditClick}>
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className={`login-btn px-3 py-2 md:px-5 md:py-2 text-sm md:text-base ${isRouletteSpinning ? 'disabled' : ''}`}
              onClick={handleLoginClick}
              disabled={isRouletteSpinning}
            >
              <span className="md:hidden">Login</span>
              <span className="hidden md:inline">Sign In</span>
            </button>
          )}
        </div>
      </header>

      {isEditing && (
        <div className="login-modal-overlay" onClick={handleCancelEdit}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="login-modal-close" onClick={handleCancelEdit}>×</button>

            <div className="login-modal-header">
              <h2>Edit Profile</h2>
            </div>

            <form className="login-form" onSubmit={handleSaveChanges}>
              <div className="form-group">
                <label htmlFor="name-edit">Username</label>
                <input
                  type="text"
                  id="name-edit"
                  name="name"
                  value={editName}
                  onChange={handleNameChange}
                  placeholder="Enter your name"
                  maxLength={20}
                />
              </div>

              <div className="form-group avatar-group">
                <label htmlFor="avatar-edit">Avatar (optional)</label>
                <div className="avatar-upload">
                  <input
                    type="file"
                    id="avatar-edit"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="avatar-input"
                  />
                  <label htmlFor="avatar-edit" className="avatar-upload-label">
                    {editAvatar ? (
                      <img src={editAvatar} alt="New Avatar Preview" className="avatar-preview" />
                    ) : currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Current Avatar" className="avatar-preview" />
                    ) : (
                      <div className="avatar-placeholder">
                        <span>+</span>
                        <p>Upload photo</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {editError && <div className="error-message">{editError}</div>}

              <button type="submit" className="submit-button">
                Save Changes
              </button>

              <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;