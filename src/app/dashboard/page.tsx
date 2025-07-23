  'use client';
  import { DocumentTextIcon } from '@heroicons/react/24/outline';
  import { useState, useEffect, useCallback } from 'react';
  import { useRouter } from 'next/navigation';
  import Link from 'next/link';
  import dynamic from 'next/dynamic';
  import Navbar from '@/components/Navbar';
  import DocumentCard from '@/components/DocumentCard';
  import StatsCard from '@/components/StatsCard';
  import { NBCPaper } from '@/lib/interfaces';  
  import { sidebarGroups, getStatCards } from '@/lib/constants';
  const DeleteModal = dynamic(() => import('@/components/DeleteModal'), {
    ssr: false,
    loading: () => <div className="hidden" />
  });
  const GeneratePaperDropdown = dynamic(() => import('@/components/GeneratePaperDropdown'), {
    ssr: false,
    loading: () => <div className="hidden" />
  });
  const ShareModal = dynamic(() => import('@/components/ShareModal'), {
    ssr: false,
    loading: () => <div className="hidden" />
  });
  export default function DashboardPage() {
    const [nbcPapers, setNbcPapers] = useState<NBCPaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState<NBCPaper | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingPaperId, setDeletingPaperId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const router = useRouter();
    const handleUnauthorized = useCallback(function handleUnauthorized(res: Response) {
      if (res.status === 401) {
        localStorage.clear();
        router.push('/');
        return true;
      }
      return false;
    }, [router]);
    // Fetch all NBC papers
    useEffect(() => {
      const fetchNbcPapers = async () => {
        try {
          setLoading(true);
          setError(null);
          const accessToken = localStorage.getItem('accessToken');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history`, { headers: { 'Authorization': `Bearer ${accessToken}` } });
          handleUnauthorized(response);

          if (!response.ok) {
            throw new Error(`Failed to fetch NBC papers: ${response.status}`);
          }

          const data = await response.json();
          setNbcPapers(data.reverse() || []);

        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NBC papers';
          setError(errorMessage);
          console.error('Error fetching NBC papers:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchNbcPapers();
    }, [handleUnauthorized]);



    const handleSharePaper = useCallback((paperId: string) => {
      const paper = nbcPapers.find(p => p._id === paperId);
      if (paper) {
        setSelectedPaper(paper);
        setShowShareModal(true);
      }
    }, [nbcPapers]);

    const closeShareModal = () => {
      setShowShareModal(false);
      setSelectedPaper(null);
    };

    // Handler for delete menu click
    const handleDeleteMenuClick = (paperId: string) => {
      setDeletingPaperId(paperId);
      setShowDeleteDialog(true);
    };

    // Confirm delete action
    const confirmDeletePaper = async () => {
      if (!deletingPaperId) return;
      setIsDeleting(true);
      try {
        const paper = nbcPapers.find(p => p._id === deletingPaperId);
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
        setNbcPapers(prev => prev.filter(p => p._id !== deletingPaperId));
        setShowDeleteDialog(false);
        setDeletingPaperId(null);
      } catch (err) {
        console.error('Error deleting document:', err);
        alert('Failed to delete document.');
      } finally {
        setIsDeleting(false);
      }
    };

    const statCards = getStatCards(nbcPapers);
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
                <button
                  key={group.name}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium hover:bg-[#48B85C]/10 transition text-gray-700`}
                >
                  <group.icon className="w-5 h-5" />
                  {group.name}
                </button>
              ))}
            </nav>
            <div className="mt-auto pt-8">
              <GeneratePaperDropdown variant="sidebar" showIcon={false} />
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1 p-10 h-[calc(100vh-100px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-700 mb-1">Generate Documents</h1>
                <p className="text-gray-500">Fill the information below to start generating business documents for your business.</p>
              </div>
              <GeneratePaperDropdown variant="main" />
            </div>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {statCards.map((card, index) => (
                <StatsCard key={index} {...card} />
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#48B85C] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading NBC Papers...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-red-600 text-lg mb-2">Error</div>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-[#48B85C] text-white px-4 py-2 rounded-lg hover:bg-[#3da050] transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* NBC Papers Cards */}
            {!loading && !error && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">Recent Papers</h2>
                  {nbcPapers.length > 6 && (
                    <Link
                      href="/archive"
                      className="text-[#48B85C] hover:text-[#3da050] font-medium text-sm transition-colors"
                    >
                      View All Papers →
                    </Link>
                  )}
                </div>
                {nbcPapers.length === 0 ? (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Papers Found</h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first document.</p>
                    <div className="inline-block">
                      <GeneratePaperDropdown 
                        variant="main" 
                        buttonText="Create First Document"
                        className="mx-auto"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* {console.log(nbcPapers)} */}
                    {nbcPapers.slice(0, 6).map((paper, idx) => (
                      <DocumentCard
                          key={paper._id || idx}
                        document={paper}
                        onShare={handleSharePaper}
                        onDelete={handleDeleteMenuClick}
                        showDeleteDialog={showDeleteDialog}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        {/* Share Modal */}
        {selectedPaper && (
          <ShareModal
            collaborators={selectedPaper.collaborators}
            isOpen={showShareModal && !showDeleteDialog}
            onClose={closeShareModal}
            documentTitle={selectedPaper.metadata.title}
            documentId={selectedPaper.entityId}
            documentType={selectedPaper.entityType as 'NbcPaper' | 'MarketReport'}
          />
        )}

        <DeleteModal
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDeletePaper}
          isLoading={isDeleting}
        />
      </div>
    );
  }
