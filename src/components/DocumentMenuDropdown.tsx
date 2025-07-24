import React, { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownTrayIcon, ShareIcon, TrashIcon, CheckIcon, PaperAirplaneIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface DocumentMenuDropdownProps {
  document: any;
  open: boolean;
  onClose: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onMarkAsReady?: () => void;
  onSubmitForApproval?: () => void;
  status?: string;
  canEdit?: boolean;
  isSubmitting?: boolean;
  triggerClassName?: string;
}

export const DocumentMenuDropdown: React.FC<DocumentMenuDropdownProps> = ({
  open,
  document,
  onClose,
  onDownload,
  onShare,
  onDelete,
  onMarkAsReady,
  onSubmitForApproval,
  status,
  canEdit,
  isSubmitting,

}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    if (typeof window === 'undefined') return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    window.document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  return (
    // <div className="relative z-[9999]">
      
      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[80%] right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999]"
            onClick={e => e.stopPropagation()}
          >
            <Link href={`/documents/${document.entityId}?type=${document.entityType === 'NbcPaper' ? 'nbc' : 'market'}`}>       
            <button className="cursor-pointer w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3">
              <DocumentTextIcon className="w-5 h-5 text-gray-700" />
              <div className="font-medium text-gray-700 text-[14px]">View Document</div>
            </button>
            </Link>
            {/* Mark as Ready Option */}
            {status === 'draft' && !isSubmitting && canEdit && onMarkAsReady && (
              <button
                onClick={() => { onClose(); onMarkAsReady(); }}
                className="cursor-pointer w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <CheckIcon className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Mark as Ready</div>
                  <div className="text-sm text-gray-500">Mark document as ready for review</div>
                </div>
              </button>
            )}
            {/* Submit for Approval Option */}
            {status === 'pending_review' && !isSubmitting && canEdit && onSubmitForApproval && (
              <button
                onClick={() => { onClose(); onSubmitForApproval(); }}
                className="cursor-pointer w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <PaperAirplaneIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Submit for Approval</div>
                  <div className="text-sm text-gray-500">Submit document for approval</div>
                </div>
              </button>
            )}
            {/* Download Option */}
            {onDownload && (
              <button
                onClick={() => { onClose(); onDownload(); }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer"
              >
                <ArrowDownTrayIcon className="w-5 h-5 text-gray-700" />
                <div className="font-medium text-gray-700 text-[14px]">Download</div>
              </button>
            )}
            {/* Share Option */}
            {onShare && (
              <button
                onClick={() => { onClose(); onShare(); }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer"
              >
                <ShareIcon className="w-5 h-5 text-gray-700" />
                <div className="font-medium text-gray-700 text-[14px]">Share</div>
              </button>
            )}
            {/* Delete Option */}
            {onDelete && (
              <button
                onClick={() => { onClose(); onDelete(); }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer"
              >
                <TrashIcon className="w-5 h-5 text-gray-600" />
                <div className="font-medium text-gray-600 text-[14px]">Delete</div>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    // </div>
  );
};

export default DocumentMenuDropdown; 