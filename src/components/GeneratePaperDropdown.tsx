'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentTextIcon, ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';

interface GeneratePaperDropdownProps {
  variant?: 'sidebar' | 'main';
  className?: string;
  buttonText?: string;
  showIcon?: boolean;
}

export default function GeneratePaperDropdown({
  variant = 'main',
  className = '',
  buttonText,
  showIcon = true
}: GeneratePaperDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const defaultButtonText = buttonText || (variant === 'sidebar' ? 'Generate New Document' : 'New Document');

  const buttonClasses = variant === 'sidebar' 
    ? 'w-full bg-[#48B85C] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#3da050] transition'
    : 'border border-[#48B85C] text-[#48B85C] bg-white px-5 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-[#48B85C] hover:text-white transition text-lg cursor-pointer';

  const dropdownClasses = variant === 'sidebar'
    ? 'absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-[9999]'
    : 'absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999]';

  const handleClose = () => setIsOpen(false);

  return (
    <div className={`relative dropdown-container ${className}`} ref={dropdownRef}>
      <button
        className={buttonClasses}
        onClick={() => setIsOpen(!isOpen)}
      >
        {showIcon && <PlusIcon className="w-5 h-5" />}
        {defaultButtonText}
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={dropdownClasses}
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href="/documents/new?type=nbc"
              className="block px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
              onClick={handleClose}
            >
              <DocumentTextIcon className="w-5 h-5 text-[#48B85C]" />
              <div>
                <div className="font-medium text-gray-900">Generate NBC Paper</div>
                <div className="text-sm text-gray-500">Create a new NBC paper</div>
              </div>
            </Link>

            <Link
              href="/documents/new?type=market"
              className="block px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
              onClick={handleClose}
            >
              <DocumentTextIcon className="w-5 h-5 text-[#48B85C]" />
              <div>
                <div className="font-medium text-gray-900">Generate Market Report</div>
                <div className="text-sm text-gray-500">Create a new market report</div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 