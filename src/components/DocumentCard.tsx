'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentTextIcon, ShareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Collaborator } from '@/lib/interfaces';
import Image from 'next/image';

interface DocumentCardProps {
  document: {
    _id: string;
    entityId: string;
    entityType: string;
    metadata: {
      title: string;
      author: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    collaborators?: Collaborator[];
  };
  onShare?: (documentId: string, title: string) => void;
  onDelete?: (documentId: string) => void;
  showDeleteDialog?: boolean;
  className?: string;
}

export default function DocumentCard({
  document,
  onShare,
  onDelete,
  showDeleteDialog = false,
  className = ''
}: DocumentCardProps) {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    };

    if (openDropdown) {
      window.document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdown(!openDropdown);
  };

  const handleCardClick = () => {
    router.push(`/documents/${document.entityId}?type=${document.entityType === 'NbcPaper' ? 'nbc' : 'market'}`);
  };

  const handleShareClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onShare?.(document._id, document.metadata.title);
    setOpenDropdown(false);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete?.(document._id);
    setOpenDropdown(false);
  };

  const getStatusStyle = (status: string) => {
    if (status === 'draft') {
      return { background: 'rgba(106, 156, 220, 0.4)', color: '#23406c' };
    } else if (status === 'published' || status === 'approved') {
      return { background: 'rgba(34, 197, 94, 0.4)', color: '#166534' };
    } else if (status === 'review' || status === 'pending') {
      return { background: 'rgba(251, 191, 36, 0.4)', color: '#92400e' };
    } else if (status === 'ready for review') {
      return { background: 'rgba(63, 167, 209, 0.4)', color: '#23406c' };
    } else {
      return { background: 'rgba(156, 163, 175, 0.4)', color: '#374151' };
    }
  };

  const statusStyle = getStatusStyle(document.metadata.status);

  // Helper function to generate consistent random color based on user ID
  const getRandomColor = (userId: string) => {
    const colors = [
      'bg-red-500',
      'bg-orange-500', 
      'bg-yellow-500',
      'bg-green-500',
      'bg-teal-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-rose-500',
      'bg-amber-500',
      'bg-lime-500',
      'bg-emerald-500',
      'bg-cyan-500',
      'bg-sky-500',
      'bg-violet-500',
      'bg-fuchsia-500'
    ];
    
    // Generate a hash from the userId to get consistent colors
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Helper function to render collaborator avatar
  const renderCollaboratorAvatar = (collaborator: Collaborator, index: number) => {
    const initials = collaborator.firstName && collaborator.lastName 
      ? `${collaborator.firstName[0]}${collaborator.lastName[0]}`
      : collaborator.email.substring(0, 2).toUpperCase();
    
    const avatarColor = getRandomColor(collaborator.userId);

    return (
      <div
        key={collaborator.userId}
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white shadow-sm ${avatarColor}`}
        style={{ 
          marginLeft: index > 0 ? '-8px' : '0',
          zIndex: 10 - index 
        }}
        title={`${collaborator.firstName || ''} ${collaborator.lastName || ''} (${collaborator.role})`}
      >
        {collaborator.profilePicture ? (
          <Image
            src={collaborator.profilePicture}
            alt={`${collaborator.firstName || ''} ${collaborator.lastName || ''}`}
            className="w-full h-full rounded-full object-cover" 
            width={24}
            height={24}
          />
        ) : (
          initials
        )}
      </div>
    );
  };

  // Get collaborators to display (limit to 5 for overlapping avatars)
  const collaboratorsToShow = document.collaborators?.slice(0, 5) || [];
  const remainingCount = (document.collaborators?.length || 0) - collaboratorsToShow.length;

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 min-h-[180px] hover:shadow-lg transition-shadow cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-2">
        {/* Status badge */}
        <span 
          className="px-3 py-1 rounded-lg text-xs font-semibold"
          style={statusStyle}
        >
          {document.metadata.status ? document.metadata.status.charAt(0).toUpperCase() + document.metadata.status.slice(1) : 'draft'}
        </span>
        
        {/* Three-dot menu */}
        <div className="paper-dropdown relative" ref={dropdownRef}>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
            onClick={toggleDropdown}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <circle cx="19" cy="12" r="2" fill="currentColor" />
            </svg>
          </button>

          <AnimatePresence>
            {openDropdown && !showDeleteDialog && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-[300px] bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999]"
                onClick={(e) => e.stopPropagation()}
              >
                {onShare && (
                  <button
                    onClick={handleShareClick}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <ShareIcon className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Share</div>
                    </div>
                  </button>
                )}
                
                {onDelete && (
                  <button
                    onClick={handleDeleteClick}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 cursor-pointer"
                  >
                    <TrashIcon className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-medium text-gray-700">Delete Document</div>
                      {/* <div className="text-sm text-gray-500">Permanently delete this document</div> */}
                    </div>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Title */}
      <div className="font-semibold text-lg text-gray-700 mb-1 line-clamp-2">
        {document.metadata.title || 'Untitled Paper'}
      </div>
      
      {/* Description/subtitle */}
      <div className="text-gray-500 text-sm mb-2 line-clamp-2">
        {document.metadata.author ? `By ${document.metadata.author}` : 'No author specified'}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-2">
        {/* Date */}
        <div className="text-gray-400 text-sm">
          {document.metadata.createdAt ? new Date(document.metadata.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : 'No date'}
        </div>
        
        {/* Collaborators */}
        <div className="flex items-center gap-2">
          {collaboratorsToShow.length > 0 && (
            <div className="flex items-center">
              {collaboratorsToShow.map((collaborator, index) => 
                renderCollaboratorAvatar(collaborator, index)
              )}
              {remainingCount > 0 && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white bg-gray-400 border-2 border-white shadow-sm"
                  style={{ marginLeft: '-8px', zIndex: 5 }}
                  title={`${remainingCount} more collaborator${remainingCount > 1 ? 's' : ''}`}
                >
                  +{remainingCount}
                </div>
              )}
            </div>
          )}
          
          {/* Document ID */}
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <DocumentTextIcon className="w-4 h-4" />
            {document._id ? document._id.slice(-6) : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
} 