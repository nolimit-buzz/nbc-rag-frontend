'use client';
import { PlusIcon, DocumentTextIcon, ArchiveBoxIcon, CheckCircleIcon, ClockIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
interface NBCPaper {
  _id: string;
  title: string;
  author: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  content: Record<string, {
    section_title: string;
    htmlContent: string;
  }>;
}

const sidebarGroups = [
  { name: 'All Papers', icon: DocumentTextIcon },
  { name: 'Drafts', icon: PencilSquareIcon },
  { name: 'Pending Review', icon: ClockIcon },
  { name: 'Approved', icon: CheckCircleIcon },
  { name: 'Archived', icon: ArchiveBoxIcon },
  { name: 'Templates', icon: DocumentTextIcon },
];

export default function DashboardPage() {
  const [nbcPapers, setNbcPapers] = useState<NBCPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch all NBC papers
  useEffect(() => {
    const fetchNbcPapers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nbc-papers`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch NBC papers: ${response.status}`);
        }
        
        const data = await response.json();
        setNbcPapers(data.papers || data.reverse() || []);
        
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NBC papers';
        setError(errorMessage);
        console.error('Error fetching NBC papers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNbcPapers();
  }, []);

  
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
            <button className="w-full bg-[#48B85C] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#3da050] transition">
              <PlusIcon className="w-5 h-5" />
              New NBC Paper
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-10 h-[calc(100vh-100px)] overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Generate NBC Papers</h1>
              <p className="text-gray-500">Fill the information below to start generating NBC papers for your business.</p>
            </div>
            <button
              className="border border-[#48B85C] text-[#48B85C] bg-white px-5 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-[#48B85C] hover:text-white transition text-lg cursor-pointer"
              onClick={() => router.push('/documents/new')}
            >
              <PlusIcon className="w-6 h-6" />
              New NBC Paper
            </button>
          </div>
          {/* Statistics Cards - Creative Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {/* Total Papers */}
            <div className="rounded-xl p-6" style={{background: 'rgba(69, 206, 227, 0.4)', border: '1px solid rgba(69, 206, 227, 0.4)'}}>
              <div>
                <div className="inline-block mb-4 px-4 py-1 rounded-full text-sm font-medium text-gray-800/80" style={{background: 'rgba(63, 195, 214, 0.4)'}}>All Papers</div>
                <div className="text-4xl font-extrabold text-gray-800 mb-2">{nbcPapers.length}</div>
                <div className="text-lg font-semibold text-gray-800 mb-1">Every NBC paper in your pipeline</div>
                <div className="text-gray-700 text-base mt-2">Track your progress from draft to approval</div>
              </div>
            </div>
            {/* Drafts */}
            <div className="rounded-xl p-6" style={{background: 'rgba(106, 156, 220, 0.4)', border: '1px solid rgba(106, 156, 220, 0.4)'}}>
              <div>
                <div className="inline-block mb-4 px-4 py-1 rounded-full text-sm font-medium text-gray-800/80" style={{background: 'rgba(106, 156, 220, 0.4)'}}>Drafts in Progress</div>
                <div className="text-4xl font-extrabold text-gray-800 mb-2">{nbcPapers.filter(p => p.status === 'draft').length}</div>
                <div className="text-lg font-semibold text-gray-800 mb-1">Papers being written or edited</div>
                <div className="text-gray-700 text-base mt-2">Keep refining your drafts for submission</div>
              </div>
            </div>
            {/* Pending Review */}
            <div className="rounded-xl p-6" style={{background: 'rgba(71, 186, 235, 0.4)', border: '1px solid rgba(71, 186, 235, 0.4)'}}>
              <div>
                <div className="inline-block mb-4 px-4 py-1 rounded-full text-sm font-medium text-gray-800/80" style={{background: 'rgba(63, 167, 209, 0.4)'}}>Awaiting Review</div>
                <div className="text-4xl font-extrabold text-gray-800 mb-2">{nbcPapers.filter(p => p.status === 'review' || p.status === 'pending').length}</div>
                <div className="text-lg font-semibold text-gray-800 mb-1">Papers submitted for review</div>
                <div className="text-gray-700 text-base mt-2">Monitor feedback and approval status</div>
              </div>
            </div>
            {/* Approved */}
            <div className="rounded-xl p-6" style={{background: 'rgba(53, 222, 177, 0.4)', border: '1px solid rgba(53, 222, 177, 0.4)'}}>
              <div>
                <div className="inline-block mb-4 px-4 py-1 rounded-full text-sm font-medium text-gray-800/80" style={{background: 'rgba(47, 202, 161, 0.4)'}}>Approved Papers</div>
                <div className="text-4xl font-extrabold text-gray-800 mb-2">{nbcPapers.filter(p => p.status === 'published' || p.status === 'approved').length}</div>
                <div className="text-lg font-semibold text-gray-800 mb-1">Papers ready for next steps</div>
                <div className="text-gray-700 text-base mt-2">Congratulations! These are ready to go</div>
              </div>
            </div>
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
                <h2 className="text-xl font-semibold text-gray-700">Recent NBC Papers</h2>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No NBC Papers Found</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first NBC paper.</p>
                  <button
                    onClick={() => router.push('/documents/new')}
                    className="bg-[#48B85C] text-white px-4 py-2 rounded-lg hover:bg-[#3da050] transition"
                  >
                    Create First Paper
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nbcPapers.slice(0, 6).map((paper, idx) => (
                    <div 
                      key={paper._id || idx} 
                      className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 min-h-[180px] hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => router.push(`/documents/${paper._id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        {/* Status badge */}
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          paper.status === 'draft' ? '' :
                          paper.status === 'published' || paper.status === 'approved' ? 'bg-green-100 text-green-700' :
                          paper.status === 'review' || paper.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`} style={paper.status === 'draft' ? {background: 'rgba(106, 156, 220, 0.4)', color: '#23406c'} : {}}>
                          {paper.status ? paper.status.charAt(0).toUpperCase() + paper.status.slice(1) : 'Unknown'}
                        </span>
                        {/* Three-dot menu */}
                        <button 
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add menu functionality here
                          }}
                        >
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>
                        </button>
                      </div>
                      {/* Title */}
                      <div className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
                        {paper.title || 'Untitled Paper'}
                      </div>
                      {/* Description/subtitle */}
                      <div className="text-gray-500 text-sm mb-2 line-clamp-2">
                        {paper.author ? `By ${paper.author}` : 'No author specified'}
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        {/* Date */}
                        <div className="text-gray-400 text-sm">
                          {paper.createdAt ? new Date(paper.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'No date'}
                        </div>
                        {/* Comments or other info */}
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <DocumentTextIcon className="w-4 h-4" />
                          {paper._id ? paper._id.slice(-6) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
