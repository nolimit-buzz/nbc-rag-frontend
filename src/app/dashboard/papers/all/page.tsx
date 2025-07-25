'use client';
import React, { useState, useCallback } from 'react';
import { FaThList, FaThLarge } from 'react-icons/fa';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { sidebarGroups } from '@/lib/constants';
import GeneratePaperDropdown from '@/components/GeneratePaperDropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandItem } from '@/components/ui/command';
import { AnimatePresence, motion } from 'framer-motion';
import { Paper } from '@/lib/interfaces';
const DeleteModal = dynamic(() => import('@/components/DeleteModal'), {
    ssr: false,
    loading: () => <div className="hidden" />
});
const ShareModal = dynamic(() => import('@/components/ShareModal'), {
    ssr: false,
    loading: () => <div className="hidden" />
}); const DocumentMenuDropdown = dynamic(() => import('@/components/DocumentMenuDropdown'), {
    ssr: false,
    loading: () => <div className="hidden" />
});
const DocumentCard = dynamic(() => import('@/components/DocumentCard'), {
    ssr: false,
    loading: () => <div className="hidden" />
});


export default function AllPapersPage() {
    const [papers, setPapers] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const PAGE_SIZE = 12;
    const [openDropdownRow, setOpenDropdownRow] = useState<string | null>(null);
    // const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const router = useRouter();

    // Popover states
    const [typePopoverOpen, setTypePopoverOpen] = useState(false);
    const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);

    // Share and Delete modal states
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingPaperId, setDeletingPaperId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const handleUnauthorized = useCallback((res: Response) => {
        console.log("res.status", res.status)
        if (res.status === 401) {
            localStorage.clear();
            router.push('/');
            return true;
        }
        return false;
    }, [router]);
    const fetchPapers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const accessToken = localStorage.getItem('accessToken');

            const params = new URLSearchParams({
                page: page.toString(),
                limit: PAGE_SIZE.toString(),
                ...(searchTerm && { search: searchTerm }),
                ...(selectedType !== 'all' && { documentType: selectedType }),
                ...(selectedStatus !== 'all' && { status: selectedStatus }),
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history?${params}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            handleUnauthorized(response)
            if (!response.ok) {
                throw new Error(`Failed to fetch papers: ${response.status}`);
            }
            const data = await response.json();
            setPapers(data.results || []);
            setTotal(data.total || 0);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch papers';
            setError(errorMessage);
            console.error('Error fetching papers:', err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedType, selectedStatus, page, handleUnauthorized]);

    React.useEffect(() => {
        fetchPapers();
    }, [searchTerm, selectedType, selectedStatus, page, fetchPapers]);


 

    // Share functionality
    const handleSharePaper = (paperId: string) => {
        const paper = papers.find(p => p._id === paperId);
        if (paper) {
            setSelectedPaper(paper);
            setShowShareModal(true);
        }
    };

    const closeShareModal = () => {
        setShowShareModal(false);
        setSelectedPaper(null);
    };

    // Delete functionality
    const handleDeletePaper = (paperId: string) => {
        setDeletingPaperId(paperId);
        setShowDeleteDialog(true);
    };

    const confirmDeletePaper = async () => {
        if (!deletingPaperId) return;
        setIsDeleting(true);
        try {
            const paper = papers.find(p => p._id === deletingPaperId);
            if (!paper) return;
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const endpoint = paper.entityType === 'MarketReport'
                ? `${baseUrl}/market-reports/${paper.entityId}`
                : `${baseUrl}/nbc-papers/${paper.entityId}`;
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (!response.ok) {
                throw new Error(`Failed to delete document: ${response.status}`);
            }
            setPapers(prev => prev.filter(p => p._id !== deletingPaperId));
            setShowDeleteDialog(false);
            setDeletingPaperId(null);
        } catch (err) {
            console.error('Error deleting document:', err);
            alert('Failed to delete document.');
        } finally {
            setIsDeleting(false);
        }
    };

    const totalPages = Math.ceil(total / PAGE_SIZE);

    const paperTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'NbcPaper', label: 'NBC Paper' },
        { value: 'MarketReport', label: 'Market Report' }
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'draft', label: 'Draft' },
        { value: 'pending_review', label: 'Pending Review' },
        { value: 'approved', label: 'Approved' },
        { value: 'published', label: 'Published' }
    ];

    return (
        <div className="min-h-screen overflow-y-hidden bg-[#ffffff] flex flex-col">
            {/* Navbar from documents page */}
            <Navbar />
            <div className="h-px bg-gray-200 w-full" />
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4">
                    <nav className="flex flex-col gap-2">
                        <div className="mb-6 text-xs text-gray-400 uppercase tracking-widest pl-2">Documents</div>
                        {sidebarGroups.map((group) => (
                            <Link
                                key={group.name}
                                href={group.link}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium hover:bg-[#48B85C]/10 transition text-gray-700 ${group.link === '/dashboard/papers/all' ? 'bg-[#48B85C]/10 text-[#48B85C]' : ''}`}
                            >
                                <group.icon className="w-5 h-5" />
                                {group.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-auto pt-8">
                        <GeneratePaperDropdown variant="sidebar" showIcon={false} />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-10 h-[calc(100vh-100px)] overflow-y-auto bg-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Header row: title and new document */}
                        <motion.div 
                            className="flex flex-col gap-2 mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                                <h1 className="text-2xl font-bold text-gray-700">All Papers</h1>
                                <GeneratePaperDropdown variant="main" />
                            </div>
                            {/* Second row: filters, search, view toggle */}
                            <motion.div 
                                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                            >
                                {/* Type Filter */}
                                <Popover open={typePopoverOpen} onOpenChange={setTypePopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="min-w-[160px] justify-between cursor-pointer">
                                            {selectedType === 'all' ? 'All Types' : selectedType === 'NbcPaper' ? 'NBC Papers' : 'Market Reports'}
                                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-0">
                                        <Command>
                                            {paperTypes.map((type) => (
                                                <CommandItem
                                                    key={type.value}
                                                    onSelect={() => {
                                                        setSelectedType(type.value);
                                                        setPage(1);
                                                        setTypePopoverOpen(false);
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    {type.label}
                                                </CommandItem>
                                            ))}
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                {/* Status Filter */}
                                <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="min-w-[140px] justify-between cursor-pointer capitalize">
                                            {selectedStatus === 'all' ? 'All Status' : selectedStatus.replace('_', ' ')}
                                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40 p-0">
                                        <Command>
                                            {statusOptions.map((status) => (
                                                <CommandItem
                                                    key={status.value}
                                                    onSelect={() => {
                                                        setSelectedStatus(status.value);
                                                        setPage(1);
                                                        setStatusPopoverOpen(false);
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    {status.label}
                                                </CommandItem>
                                            ))}
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                {/* Search */}
                                <Input
                                    placeholder="Search papers by title..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-64 hover:outline-none   !focus:outline-none focus:border-[#48B85C] !focus:ring-0 !focus:ring-offset-0"
                                />

                                {/* View Toggle */}
                                <div className="flex rounded-md border border-gray-200 overflow-hidden bg-gray-50">
                                    <button
                                        className={`px-3 py-2 flex items-center gap-1 text-sm font-medium transition-colors focus:outline-none ${viewMode === 'list' ? 'bg-white text-[#48B85C]' : 'text-gray-500 hover:bg-gray-100'} rounded-l-md border-r border-gray-200 cursor-pointer`}
                                        onClick={() => setViewMode('list')}
                                        aria-pressed={viewMode === 'list'}
                                        type="button"
                                    >
                                        <FaThList /> List
                                    </button>
                                    <button
                                        className={`px-3 py-2 flex items-center gap-1 text-sm font-medium transition-colors focus:outline-none ${viewMode === 'grid' ? 'bg-white text-[#48B85C]' : 'text-gray-500 hover:bg-gray-100'} rounded-r-md cursor-pointer`}
                                        onClick={() => setViewMode('grid')}
                                        aria-pressed={viewMode === 'grid'}
                                        type="button"
                                    >
                                        <FaThLarge /> Grid
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                        >
                            <div>
                                {loading ? (
                                    <div className="text-center py-10">Loading...</div>
                                ) : papers.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground">No papers found.</div>
                                ) : error ? (
                                    <div className="text-center py-10 text-red-500">{error}</div>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        {viewMode === 'list' ? (
                                            <motion.div
                                                key="list"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="bg-white rounded-xl border border-gray-200 overflow-visible"
                                            >
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr className="text-gray-500 text-xs font-normal border-b border-gray-100">
                                                            <th className="px-4 py-4 text-left uppercase font-normal">Title</th>
                                                            <th className="px-4 py-4 text-left uppercase font-normal">Type</th>
                                                            <th className="px-4 py-4 text-center uppercase font-normal">Status</th>
                                                            <th className="px-4 py-4 text-left uppercase font-normal">Created</th>
                                                            <th className="px-4 py-4 text-center uppercase font-normal">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {papers.map((paper) => {
                                                            const status = (paper.metadata.status || '-').toLowerCase();
                                                            let statusColor = 'bg-gray-200 text-gray-700';
                                                            if (status === 'draft') statusColor = 'bg-[rgba(106,156,220,0.4)] ]';
                                                            if (status === 'pending_review') statusColor = 'bg-[rgba(63,167,209,0.4)] text-[#23406c';
                                                            if (status === 'published' || status === 'approved') statusColor = 'bg-[rgba(47,202,161,0.4)] text-[#23406c';
                                                            return (
                                                                <tr onClick={() => router.push(`/documents/${paper.entityId}?type=${paper.entityType === 'NbcPaper' ? 'nbc' : 'market'}`)}
                                                                    key={paper._id}
                                                                    className="hover:bg-gray-50 transition cursor-pointer border-b border-gray-100 last:border-b-0"
                                                                >
                                                                    <td className="px-4 py-4 font-medium text-gray-700 whitespace-nowrap max-w-xs truncate">
                                                                        <div className="flex items-center">
                                                                            <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#48B85C] text-white font-semibold text-xs mr-2">
                                                                                {paper.metadata.author
                                                                                    ? paper.metadata.author.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                                                                                    : 'NA'}
                                                                            </span>
                                                                            {paper.metadata.title}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-4 whitespace-nowrap text-left text-gray-500">
                                                                        {paper.entityType === 'NbcPaper' ? 'NBC' : 'Market Report'}
                                                                    </td>
                                                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                                                        <span className={`shrink-0 inline-block px-2 py-1 rounded-full text-xs font-medium capitalize mx-auto ${statusColor}`}>
                                                                            {status.replace('_', ' ')}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-4 whitespace-nowrap text-gray-500 text-sm">
                                                                        {new Date(paper.metadata.createdAt).toLocaleDateString('en-US', {
                                                                            year: 'numeric', month: 'short', day: 'numeric',
                                                                        })}
                                                                    </td>
                                                                    <td className="px-4 py-4 whitespace-nowrap text-center relative">
                                                                        <button
                                                                            onClick={() => setOpenDropdownRow(openDropdownRow === paper._id ? null : paper._id)}
                                                                            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer`}
                                                                            aria-label="Open menu"
                                                                        >
                                                                            <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                                                                        </button>
                                                                        {openDropdownRow === paper._id && <DocumentMenuDropdown
                                                                            document={paper}
                                                                            open={openDropdownRow === paper._id}
                                                                            onClose={() => setOpenDropdownRow(null)}
                                                                            onShare={() => handleSharePaper(paper._id)}
                                                                            onDelete={() => handleDeletePaper(paper._id)}
                                                                            status={paper.metadata.status || 'draft'}
                                                                            canEdit={true}
                                                                            triggerClassName=""
                                                                        />}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </motion.div>
                                        ) : (
                                          <motion.div
                                            key="grid"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                                          >
                                            {papers.map((paper, index) => (
                                              <motion.div
                                                key={paper._id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ 
                                                  duration: 0.3, 
                                                  delay: index * 0.05,
                                                  ease: "easeOut"
                                                }}
                                              >
                                                <DocumentCard
                                                  document={{
                                                    _id: paper._id,
                                                    entityId: paper.entityId,
                                                    entityType: paper.entityType,
                                                    metadata: {
                                                      title: paper.metadata.title || 'Untitled',
                                                      author: paper.metadata.author || 'No author',
                                                      status: paper.metadata.status || 'draft',
                                                      createdAt: paper.metadata.createdAt,
                                                      updatedAt: paper.metadata.updatedAt || paper.metadata.createdAt,
                                                    },
                                                    collaborators: paper.collaborators || [],
                                                  }}
                                                  onShare={() => handleSharePaper(paper._id)}
                                                  onDelete={() => handleDeletePaper(paper._id)}
                                                  showDeleteDialog={showDeleteDialog}
                                                />
                                              </motion.div>
                                            ))}
                                          </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </div>
                        </motion.div>

                        {/* Pagination controls */}
                        {totalPages > 1 && (
                            <motion.div 
                                className="flex justify-center items-center gap-2 mt-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                            >
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="cursor-pointer"
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-gray-700">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="cursor-pointer"
                                >
                                    Next
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                </main>
            </div>

            {/* Share Modal */}
            {selectedPaper && (
                <ShareModal
                    collaborators={selectedPaper.collaborators || []}
                    isOpen={showShareModal && !showDeleteDialog}
                    onClose={closeShareModal}
                    documentTitle={selectedPaper.metadata.title}
                    documentId={selectedPaper.entityId}
                    documentType={selectedPaper.entityType as 'NbcPaper' | 'MarketReport'}
                />
            )}

            {/* Delete Modal */}
            <DeleteModal
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDeletePaper}
                isLoading={isDeleting}
            />
        </div>
    );
} 