'use client';
import React, { useState, useCallback } from 'react';
import { FaThList, FaThLarge, FaPlus, FaDownload, FaEllipsisV } from 'react-icons/fa';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
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

// Template interface
interface Template {
    _id: string;
    name: string;
    category: string;
    type: 'MarketReport' | 'NbcPaper' | 'BusinessPaper';
    description: string;
    createdAt: string;
    updatedAt: string;
    downloads: number;
    isActive: boolean;
}

// const CreateTemplateModal = dynamic(() => import('@/components/CreateTemplateModal'), {
//     ssr: false,
//     loading: () => <div className="hidden" />
// });

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const router = useRouter();

    // Popover states
    const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);

    // Categories for templates
    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'market-reports', label: 'Market Reports' },
        { value: 'nbc-papers', label: 'NBC Papers' },
    ];

    // Only real templates
    const mockTemplates: Template[] = [
        {
            _id: '1',
            name: 'Market Report',
            category: 'market-reports',
            type: 'MarketReport',
            description: 'Comprehensive market report template for your business needs.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-15',
            downloads: 45,
            isActive: true
        },
        {
            _id: '2',
            name: 'NBC Paper',
            category: 'nbc-papers',
            type: 'NbcPaper',
            description: 'Standard NBC research paper template.',
            createdAt: '2024-01-02',
            updatedAt: '2024-01-10',
            downloads: 32,
            isActive: true
        }
    ];

    React.useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setTemplates(mockTemplates);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            template.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const templateCounts = templates.reduce((acc, template) => {
        const category = template.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const handleDownload = (templateId: string) => {
        // Handle template download
        console.log('Downloading template:', templateId);
    };

    const handleCreateTemplate = () => {
        setShowCreateModal(true);
    };

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(selectedTemplate === templateId ? null : templateId);
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'market-reports': return 'bg-blue-500';
            case 'nbc-papers': return 'bg-green-500';
            case 'business-papers': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const getCategoryName = (category: string) => {
        const cat = categories.find(c => c.value === category);
        return cat ? cat.label : 'Unknown';
    };

    return (
        <div className="min-h-screen overflow-y-hidden bg-[#ffffff] flex flex-col">
            {/* Navbar */}
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
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium hover:bg-[#48B85C]/10 transition text-gray-700 ${group.link === '/dashboard/templates' ? 'bg-[#48B85C]/10 text-[#48B85C]' : ''}`}
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
                        {/* Header row: title and new template */}
                        <motion.div
                            className="flex flex-col gap-2 mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => router.back()}
                                        className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-gray-700"
                                    >
                                        <ArrowLeftIcon className="w-4 h-4" />
                                        <p>Back</p>
                                    </button>
                                    <h1 className="text-2xl font-bold text-gray-700">Templates</h1>
                                </div>
                                <Button
                                    onClick={handleCreateTemplate}
                                    className="bg-[#48B85C] hover:bg-[#48B85C]/90 text-white flex items-center gap-2"
                                >
                                    <FaPlus className="w-4 h-4" />
                                    Add Template
                                </Button>
                            </div>
                            
                            {/* Second row: filters, search, view toggle */}
                            <motion.div
                                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                            >
                                {/* Category Filter */}
                                <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="min-w-[160px] justify-between cursor-pointer">
                                            {selectedCategory === 'all' ? 'All Categories' : getCategoryName(selectedCategory)}
                                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-0">
                                        <Command>
                                            {categories.map((category) => (
                                                <CommandItem
                                                    key={category.value}
                                                    onSelect={() => {
                                                        setSelectedCategory(category.value);
                                                        setCategoryPopoverOpen(false);
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    {category.label}
                                                </CommandItem>
                                            ))}
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                {/* Search */}
                                <Input
                                    placeholder="Search templates..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64 hover:outline-none focus:outline-none focus:border-[#48B85C] focus:ring-0 focus:ring-offset-0"
                                />

                                {/* View Toggle */}
                                <div className="flex rounded-md border border-gray-200 overflow-hidden bg-gray-50">
                                    <button
                                        className={`px-3 py-2 flex items-center gap-1 text-sm font-medium transition-colors focus:outline-none ${viewMode === 'grid' ? 'bg-white text-[#48B85C]' : 'text-gray-500 hover:bg-gray-100'} rounded-l-md border-r border-gray-200 cursor-pointer`}
                                        onClick={() => setViewMode('grid')}
                                        aria-pressed={viewMode === 'grid'}
                                        type="button"
                                    >
                                        <FaThLarge /> Grid
                                    </button>
                                    <button
                                        className={`px-3 py-2 flex items-center gap-1 text-sm font-medium transition-colors focus:outline-none ${viewMode === 'list' ? 'bg-white text-[#48B85C]' : 'text-gray-500 hover:bg-gray-100'} rounded-r-md cursor-pointer`}
                                        onClick={() => setViewMode('list')}
                                        aria-pressed={viewMode === 'list'}
                                        type="button"
                                    >
                                        <FaThList /> List
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="flex flex-wrap gap-4 mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                        >
                            {categories.slice(1).map((category) => (
                                <div key={category.value} className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
                                    <div className="text-sm text-gray-600">{category.label}</div>
                                    <div className="text-lg font-semibold text-gray-800">
                                        {templateCounts[category.value] || 0}
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Templates Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                        >
                            {loading ? (
                                <div className="text-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#48B85C] mx-auto"></div>
                                    <p className="mt-2 text-gray-600">Loading templates...</p>
                                </div>
                            ) : filteredTemplates.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">No templates found.</div>
                            ) : error ? (
                                <div className="text-center py-10 text-red-500">{error}</div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    {viewMode === 'grid' ? (
                                        <motion.div
                                            key="grid"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                        >
                                            {filteredTemplates.map((template, index) => (
                                                <motion.div
                                                    key={template._id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay: index * 0.05,
                                                        ease: "easeOut"
                                                    }}
                                                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer relative"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className={`w-3 h-3 rounded ${getCategoryColor(template.category)}`}></div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleTemplateSelect(template._id);
                                                            }}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <FaEllipsisV className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    
                                                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                                                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                                                    
                                                    <div className="text-xs text-gray-500">
                                                        Created: {new Date(template.createdAt).toLocaleDateString()}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
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
                                                        <th className="px-4 py-4 text-left uppercase font-normal">Template</th>
                                                        <th className="px-4 py-4 text-left uppercase font-normal">Category</th>
                                                        <th className="px-4 py-4 text-left uppercase font-normal">Created</th>
                                                        <th className="px-4 py-4 text-center uppercase font-normal">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredTemplates.map((template) => (
                                                        <tr key={template._id} className="hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0">
                                                            <td className="px-4 py-4">
                                                                <div>
                                                                    <div className="font-medium text-gray-700">{template.name}</div>
                                                                    <div className="text-sm text-gray-500">{template.description}</div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-3 h-3 rounded ${getCategoryColor(template.category)}`}></div>
                                                                    <span className="text-sm text-gray-700">{getCategoryName(template.category)}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 text-sm text-gray-500">
                                                                {new Date(template.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-4 py-4 text-center">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button
                                                                        onClick={() => handleTemplateSelect(template._id)}
                                                                        className="text-gray-400 hover:text-gray-600"
                                                                    >
                                                                        <FaEllipsisV className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </motion.div>
                    </motion.div>
                </main>
            </div>

            {/* Create Template Modal */}
            {/* {showCreateModal && (
                <CreateTemplateModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={(newTemplate) => {
                        setTemplates(prev => [newTemplate, ...prev]);
                        setShowCreateModal(false);
                    }}
                />
            )} */}
        </div>
    );
} 