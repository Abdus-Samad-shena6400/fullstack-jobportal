import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * ProfileCard Component - Displays user profile with image from URL
 * 
 * IMAGE LOADING STRATEGY:
 * ========================
 * 
 * Instead of file uploads, use pre-configured image URLs:
 * 1. User generates a placeholder at: https://api.dicebear.com/7.x/avataaars/svg?seed={email}
 * 2. User uploads to Cloudinary/S3 and gets URL
 * 3. Store URL in database (user.profile.profilePicture)
 * 4. Display via <img src={url} />
 * 
 * Benefits:
 * - No local file uploads needed
 * - Works across all deployments (Render, Vercel, etc.)
 * - Faster loading (CDN-hosted)
 * - No storage limitations
 * - Easy to update/change
 */

const ProfileCard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Generate default avatar if no profile picture exists
  // Uses DiceBear API (free, no auth required)
  const getDefaultAvatarUrl = (email) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;
  };

  // Get profile picture URL - fallback to generated avatar
  const profilePictureUrl = user?.profile?.profilePicture || getDefaultAvatarUrl(user?.email);

  // Handle image loading errors - show fallback
  const handleImageError = () => {
    console.error('❌ Failed to load profile image:', profilePictureUrl);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('✅ Profile image loaded successfully');
    setIsLoading(false);
  };

  // Fallback avatar if image fails to load
  const fallbackAvatar = (
    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
      {user?.name?.charAt(0).toUpperCase() || 'U'}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-4">
        {/* Profile Picture from URL or Fallback */}
        <div className="relative">
          {!imageError ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              )}
              <img
                src={profilePictureUrl}
                alt={user?.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            </>
          ) : (
            fallbackAvatar
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {user?.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {user?.role === 'employer' ? 'Employer' : 'Job Seeker'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>

          {/* Display Skills if available */}
          {user?.profile?.skills && user.profile.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {user.profile.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                >
                  {skill}
                </span>
              ))}
              {user.profile.skills.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{user.profile.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

/**
 * USAGE NOTES FOR PROFILE IMAGES:
 * ===============================
 * 
 * 1. SETTING PROFILE PICTURE:
 *    - User provides image URL via form
 *    - Backend validates URL is valid
 *    - Stores URL in: user.profile.profilePicture
 *    - Example: "https://lh3.googleusercontent.com/a/AVvXsEj..."
 * 
 * 2. SUPPORTED IMAGE SOURCES:
 *    - Google Drive (public link): "https://drive.google.com/uc?export=view&id=..."
 *    - Unsplash: "https://images.unsplash.com/..."
 *    - Avatar APIs: "https://api.dicebear.com/7.x/avataaars/svg?seed=..."
 *    - Cloudinary: "https://res.cloudinary.com/..."
 *    - S3/AWS: "https://bucket.s3.amazonaws.com/..."
 * 
 * 3. FALLBACK STRATEGY:
 *    - If no profile picture: Use DiceBear API (deterministic, seed = email)
 *    - If image fails to load: Show gradient avatar with user initial
 *    - If both fail: Show placeholder
 * 
 * 4. PERFORMANCE:
 *    - lazy loading attribute for better performance
 *    - isLoading state prevents layout shift
 *    - onError handling provides graceful degradation
 * 
 * 5. NO LOCAL UPLOADS:
 *    - Don't store files in /uploads directory
 *    - Don't serve files from backend
 *    - Use URLs instead (scalable, CDN-friendly)
 */
