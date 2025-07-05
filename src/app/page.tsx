'use client';
import { PlusIcon, DocumentTextIcon, ArchiveBoxIcon, CheckCircleIcon, ClockIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
  const [activeMenu, setActiveMenu] = useState("Dashboard");
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

  // Calculate statistics from real data
  const stats = [
    { 
      name: 'Total NBC Papers', 
      value: nbcPapers.length, 
      icon: DocumentTextIcon, 
      color: 'bg-[#48B85C] text-white' 
    },
    { 
      name: 'Drafts', 
      value: nbcPapers.filter(paper => paper.status === 'draft').length, 
      icon: PencilSquareIcon, 
      color: 'bg-[#1454D5] text-white' 
    },
    { 
      name: 'Pending', 
      value: nbcPapers.filter(paper => paper.status === 'review' || paper.status === 'pending').length, 
      icon: ClockIcon, 
      color: 'bg-[#F3873F] text-white' 
    },
    { 
      name: 'Approved', 
      value: nbcPapers.filter(paper => paper.status === 'published' || paper.status === 'approved').length, 
      icon: CheckCircleIcon, 
      color: 'bg-[#4E419F] text-white' 
    },
  ];

  console.log(activeMenu);
  return (
    <div className="min-h-screen overflow-y-hidden bg-[#ffffff] flex flex-col">
      {/* Navbar from documents page */}
      <nav className="top-0 left-0 right-0 z-30 h-20 bg-gray-50 shadow-sm flex items-center px-8">
        <Link href="/">
          <div className="flex items-center gap-2 mr-32">
            <Image src="/logo.svg" alt="DigiCred Logo" width={120} height={100} className="w-28 h-auto" />
          </div>
        </Link>
        <div className="flex gap-10 text-gray-700 font-medium text-sm relative">
          {[
            "Dashboard",
            "Cases",
            "Planning",
            "Evaluations"
          ].map((item) => (
            <motion.div
              key={item}
              className="relative flex items-center cursor-pointer"
              onClick={() => setActiveMenu(item)}
              whileHover={{ scale: 1.08, color: '#48B85C' }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {activeMenu === item && (
                <span className="absolute -left-3 w-1 h-1 rounded-full bg-[#48B85C]" />
              )}
              <a
                href={item === "Dashboard" ? "/" : item.toLowerCase()}
                className={`transition ${
                  activeMenu === item ? "text-[#48B85C] font-semibold" : ""
                }`}
              >
                {item}
              </a>
            </motion.div>
          ))}
        </div>
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            placeholder="Search for an NBC Paper by Name..."
            className="w-[340px] rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#48B85C]"
          />
        </div>
        <div className="flex items-center gap-4 ml-8">
          <span className="text-gray-500 text-sm">Chinua Azubuike</span>
          <div className="w-9 h-9 rounded-full bg-[#48B85C] flex items-center justify-center text-lg font-extrabold text-white">CA</div>
        </div>
      </nav>
      <div className="h-px bg-gray-200 w-full" />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4">
          <nav className="flex flex-col gap-2">
            <div className="mb-6 text-xs text-gray-400 uppercase tracking-widest pl-2">Articles</div>
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
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {stats.map((stat) => (
              <div key={stat.name} className={`rounded-xl p-6 flex flex-col items-center ${stat.color}`}>
                <stat.icon className="w-8 h-8 mb-2 opacity-90" />
                <div className="text-3xl font-extrabold">{stat.value}</div>
                <div className="text-base font-semibold">{stat.name}</div>
              </div>
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
                          paper.status === 'draft' ? 'bg-blue-100 text-blue-700' :
                          paper.status === 'published' || paper.status === 'approved' ? 'bg-green-100 text-green-700' :
                          paper.status === 'review' || paper.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
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
