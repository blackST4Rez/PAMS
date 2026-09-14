import { useRef, useState } from 'react';
import { FaUserCircle, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ProfileHeader = () => {
  const { user, updateAvatar } = useAuth();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(user?.avatar || null);
  const roleLabel = user?.roles?.[0]?.replace(/_/g, ' ') || 'User';

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP images are allowed');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image must be 2 MB or smaller');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);
      updateAvatar(dataUrl);
      toast.success('Profile picture updated');
    };
    reader.onerror = () => toast.error('Failed to read file');
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const avatarSrc = preview || user?.avatar;

  return (
    <div className="rounded-xl p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
      <div className="shrink-0">
        <button
          type="button"
          onClick={handleAvatarClick}
          className="relative group w-24 h-24 rounded-full overflow-hidden"
          aria-label="Change profile picture"
        >
          {avatarSrc ? (
            <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <FaUserCircle className="w-full h-full text-[#173ef0]" />
          )}

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
            <FaCamera className="w-5 h-5 text-white" />
            <span className="text-[10px] text-white font-medium uppercase tracking-wider">Change</span>
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-white">{user?.fullName || user?.username}</h1>
        <p className="text-white/60 mt-1">@{user?.username}</p>
        <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#173ef0] text-white">
            {roleLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;