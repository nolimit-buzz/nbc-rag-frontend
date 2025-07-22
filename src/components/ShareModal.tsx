  'use client';
  import { useState, useEffect } from 'react';
  import { motion } from 'framer-motion';
  import { DocumentTextIcon, XMarkIcon, UserGroupIcon } from '@heroicons/react/24/outline';
  import { MultiSelect } from '@/components/ui/multi-select';
  import { Collaborator } from '@/lib/interfaces';
  interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    role?: string;
  }

  interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentTitle: string;
    documentId: string;
    documentType: 'NbcPaper' | 'MarketReport';
    className?: string;
    collaborators: Collaborator[];
  }

  export default function ShareModal({
    isOpen,
    onClose,
    documentTitle,
    documentId,
    documentType,
    className = '',
    collaborators = []
  }: ShareModalProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    // const [selectedTab, setSelectedTab] = useState<'team' | 'channel' | 'guests'>('team');
    // const [inviteLink, setInviteLink] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [inviteStatus, setInviteStatus] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('can_view');
      const [query, setQuery] = useState<string>('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

      // const generateInviteLink = useCallback(() => {
      //   const baseUrl = window.location.origin;
    // const link = `${baseUrl}/documents/${documentId}?type=${documentType === 'NbcPaper' ? 'nbc' : 'market'}&shared=true`;
    // setInviteLink(link);
  // }, [documentId, documentType]);

  // const copyInviteLink = async () => {
  //   try {
  //     await navigator.clipboard.writeText(inviteLink);
  //     alert('Link copied to clipboard!');
  //   } catch (err) {
  //     console.error('Failed to copy link:', err);
  //   }
  // };
  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      // generateInviteLink();
    }
  }, [isOpen, documentId]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      if (query.trim()) {
        console.log('Searching for:', query);
        fetchUsers(query);
      } else {
        console.log('Fetching all users');
        fetchUsers();
      }
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [query]); 

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);



    const fetchUsers = async (query?: string) => {
      console.log('fetchUsers', query);
      try {
        setLoadingUsers(true);
        const accessToken = localStorage.getItem('accessToken');
        const url = query
          ? `${process.env.NEXT_PUBLIC_API_URL}/users/all?query=${encodeURIComponent(query)}`
          : `${process.env.NEXT_PUBLIC_API_URL}/users/all`;

        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.users || data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };


    const handleUserSelectionChange = (newSelectedUsers: User[]) => {
      setSelectedUsers(newSelectedUsers);
    };

    const handleInvite = async () => {
      if (selectedUsers.length === 0) return;

      setIsInviting(true);
      setInviteStatus('Preparing invitation...');

      try {
        // Simulate preparation step
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInviteStatus('Sending invitation...');

        // Determine the API endpoint based on document type
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const endpoint = documentType === 'MarketReport'
          ? `${baseUrl}/market-reports/${documentId}`
          : `${baseUrl}/nbc-papers/${documentId}`;
        const accessToken = localStorage.getItem('accessToken');

        // Prepare invitation data
        const invitationData = [...collaborators, ...selectedUsers.map(user => ({
          userId: user._id,
          email: user.email,
          role: selectedRole,
          invitedAt: new Date().toISOString(),
        }))];

        // Send PUT request to invite users
        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
          body: JSON.stringify({ collaborators: invitationData })
        });

        if (!response.ok) {
          throw new Error(`Failed to invite users: ${response.status}`);
        }

        setInviteStatus('Invitation sent successfully!');

        // Reset form
        setTimeout(() => {
          setIsInviting(false);
          setInviteStatus('');
          setSelectedUsers([]);
          onClose();
        }, 2000);

      } catch (err) {
        // const errorMessage = err instanceof Error ? err.message : 'Failed to invite users';
        setInviteStatus('Invitation failed');
        console.error('Error inviting users:', err);

        setTimeout(() => {
          setIsInviting(false);
          setInviteStatus('');
        }, 2000);
      }
    };

    const handleClose = () => {
      // setSelectedTab('team');
      setSelectedUsers([]);
      setInviteStatus('');
      setIsInviting(false);
      onClose();
    };

    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-gray-900 rounded-xl shadow-2xl z-[10000] max-h-[90vh] overflow-hidden ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-gray-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Share Document</h2>
                <p className="text-sm text-gray-400">{documentTitle}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-hidden h-[400px]">
            {/* Invite Link Section */}
            {/* <div className="mb-8">
              <h3 className="text-white font-medium mb-2">Invite Link</h3>
              <p className="text-gray-400 text-sm mb-4">
                Share this secret link to invite people to this document. Only team admins can see this.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Generating invite link..."
                />
                <button
                  onClick={copyInviteLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div> */}

            {/* Team Section */}
            <div>
              <h3 className="text-white font-medium mb-4">Team</h3>

              {/* Invite Bar */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative user-input-container">
                  <MultiSelect
                    query={query}
                    setQuery={setQuery}
                    users={users}
                    selectedUsers={selectedUsers}
                    onSelectionChange={handleUserSelectionChange}
                    placeholder="Type name or email"
                    loading={loadingUsers}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="admin">admin</option>
                  <option value="can_edit">can edit</option>
                  <option value="can_view">can view</option>
                </select>
                <button
                  onClick={handleInvite}
                  disabled={isInviting || selectedUsers.length === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${isInviting || selectedUsers.length === 0
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {isInviting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Inviting...
                    </>
                  ) : (
                    'Invite'
                  )}
                </button>
              </div>

              {/* Invite Status */}
              {isInviting && (
                <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                  <div className="text-blue-400 text-sm">{inviteStatus}</div>
                </div>
              )}

              {/* Access Info */}
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <UserGroupIcon className="w-4 h-4" />
                <span>People in your team can access this file.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    );
  } 