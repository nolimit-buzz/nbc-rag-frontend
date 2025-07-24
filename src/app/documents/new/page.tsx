"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { COUNTRIES as countries } from "@/lib/constants";
import { sidebarGroups } from "@/lib/constants";
// SDG Goals data
const SDG_GOALS = [
  { number: 1, title: "No Poverty" },
  { number: 2, title: "Zero Hunger" },
  { number: 3, title: "Good Health and Well-being" },
  { number: 4, title: "Quality Education" },
  { number: 5, title: "Gender Equality" },
  { number: 6, title: "Clean Water and Sanitation" },
  { number: 7, title: "Affordable and Clean Energy" },
  { number: 8, title: "Decent Work and Economic Growth" },
  { number: 9, title: "Industry, Innovation and Infrastructure" },
  { number: 10, title: "Reduced Inequalities" },
  { number: 11, title: "Sustainable Cities and Communities" },
  { number: 12, title: "Responsible Consumption and Production" },
  { number: 13, title: "Climate Action" },
  { number: 14, title: "Life Below Water" },
  { number: 15, title: "Life on Land" },
  { number: 16, title: "Peace, Justice and Strong Institutions" },
  { number: 17, title: "Partnerships for the Goals" }
];

interface FormData {
  companyName: string;
  sector: string;
  transactionType: string;
  structuringLeads: string[];
  sponsors: string[];
  projectDetails: {
    location: string;
    sdgGoal: string;
    tenor: string;
    debtNeed: string;
  };
  marketContext: string;
  dueDiligenceFlags: string[];
}

interface FormErrors {
  companyName?: string;
  transactionType?: string;
  structuringLeads?: Record<number, string>;
  sponsors?: Record<number, string>;
  location?: string;
  sdgGoal?: string;
  tenor?: string;
  debtNeed?: string;
  marketContext?: string;
  dueDiligenceFlags?: Record<number, string>;
}

const steps = [
  { label: "Basic Info" },
  { label: "Project Details" },
  // { label: "Other Info" }, // Hidden for now
];

const initialForm: FormData = {
  companyName: "Electrify Microgrid Limited",
  sector: "Energy",
  transactionType: "NBC",
  structuringLeads: ["Electrify Microgrid Limited"],
  sponsors: ["Electrify Microgrid Limited"],
  projectDetails: {
    location: "Nigeria",
    sdgGoal: "No Poverty",
    tenor: "10 years",
    debtNeed: "100 million",
  },
  marketContext: "Nigeria is a country with a large population and a growing economy. It is a major oil producer and has a large agricultural sector. It is also a major producer of minerals and has a large manufacturing sector.",
  dueDiligenceFlags: ["No Poverty"]
};

// const sidebarGroups = [
//   { name: 'All Papers', icon: DocumentTextIcon },
//   { name: 'Drafts', icon: PencilSquareIcon },
//   { name: 'Pending Review', icon: ClockIcon },
//   { name: 'Approved', icon: CheckCircleIcon },
//   { name: 'Archived', icon: ArchiveBoxIcon },
//   { name: 'Templates', icon: DocumentTextIcon },
// ];

export default function NewNBCPaper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewDocumentForm />
    </Suspense>
  );
}

function NewDocumentForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('nbc');
  const [marketForm, setMarketForm] = useState({ countryName: '' ,year: ''});
  const [marketErrors, setMarketErrors] = useState<{ countryName?: string }>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  // List of all countries


  // Get document type from URL params
  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setDocumentType(type);
    }
  }, [searchParams]);

  useEffect(() => {
    if (documentType === 'nbc') {
      setStep(0); // Start from Basic Info for NBC
    } else if (documentType === 'draft') {
      setStep(0); // Start from Basic Info for Drafts
    } else {
      setStep(0); // Default to Basic Info
    }
  }, [documentType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field: keyof Pick<FormData, 'structuringLeads' | 'sponsors' | 'dueDiligenceFlags'>, idx: number, value: string) => {
    setForm((prev: FormData) => ({
      ...prev,
      [field]: prev[field].map((v: string, i: number) => (i === idx ? value : v)),
    }));
  };

  const handleProjectDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: FormData) => ({
      ...prev,
      projectDetails: { ...prev.projectDetails, [name]: value },
    }));
  };

  const addArrayField = (field: keyof Pick<FormData, 'structuringLeads' | 'sponsors' | 'dueDiligenceFlags'>) => {
    setForm((prev: FormData) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleMarketChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMarketForm(prev => ({ ...prev, [name]: value }));
  };

  const validateMarketForm = () => {
    const newErrors: { countryName?: string, year?: string } = {};
    if (!marketForm.countryName.trim()) {
      newErrors.countryName = 'Country is required';
    } else if (!marketForm.year.trim()) {
      newErrors.year = 'Year is required';
    }
    setMarketErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep = () => {
    const newErrors: FormErrors = {};
    if (step === 0) {
      if (!form.companyName.trim()) newErrors.companyName = 'Required field';
      if (!form.transactionType.trim()) newErrors.transactionType = 'Required field';
      form.structuringLeads.forEach((lead, idx) => {
        if (!lead.trim()) {
          if (!newErrors.structuringLeads) newErrors.structuringLeads = {};
          newErrors.structuringLeads[idx] = 'Required field';
        }
      });
      form.sponsors.forEach((sponsor, idx) => {
        if (!sponsor.trim()) {
          if (!newErrors.sponsors) newErrors.sponsors = {};
          newErrors.sponsors[idx] = 'Required field';
        }
      });
    }
    if (step === 1) {
      if (!form.projectDetails.location.trim()) newErrors.location = 'Required field';
      if (!form.projectDetails.sdgGoal.trim()) newErrors.sdgGoal = 'Required field';
      if (!form.projectDetails.tenor.trim()) newErrors.tenor = 'Required field';
      if (!form.projectDetails.debtNeed.trim()) newErrors.debtNeed = 'Required field';
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (documentType === 'market') {
      if (!validateMarketForm()) return;
    } else {
      if (!validateStep()) return;
    }
    
    setIsCreating(true);
    setCreationStatus('Retrieving relevant data...');
    
    try {
      // Simulate data retrieval step
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCreationStatus(documentType === 'market' ? 'Generating the market report...' : 'Generating the NBC paper...');
      
      // Simulate generation step
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCreationStatus('Applying finishing touches...');
      
      // Simulate finalization step
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let body;
      let endpoint;
      
      if (documentType === 'market') {
        body = {
          countryName: marketForm.countryName,
          year: marketForm.year,
        };
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/market-reports/create`;
      } else {
        // Format the body to match the required API structure for NBC
        body = {
          structuringLeads: form.structuringLeads,
          companyName: form.companyName,
          transactionType: form.transactionType,
          sponsors: form.sponsors,
          projectDetails: {
            tenor: form.projectDetails.tenor ? Number(form.projectDetails.tenor) : undefined,
            location: form.projectDetails.location,
            debtNeed: form.projectDetails.debtNeed ? Number(form.projectDetails.debtNeed) : undefined,
            sdgGoals: form.projectDetails.sdgGoal ? form.projectDetails.sdgGoal : undefined,
          },
        };
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/nbc-papers/create`;
      }
      
      setCreationStatus('Saving to database...');
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
      console.log(res);
      if (!res.ok) throw new Error(`Failed to create ${documentType === 'market' ? 'Market Report' : 'NBC Paper'}`);
      const data = await res.json();
      if (documentType === 'market') {
        if (data.success && data.marketReport && data.marketReport.id) {
          setCreationStatus('Redirecting to document...');
          await new Promise(resolve => setTimeout(resolve, 500));
          router.push(`/documents/${data.marketReport.id}?type=market`);
        } else {
          throw new Error('Invalid response format');
        }
      } else if (data.success && data.nbcPaper && data.nbcPaper.id) {
        setCreationStatus('Redirecting to document...');
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(`/documents/${data.nbcPaper.id}?type=nbc`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setSubmitError(errorMessage);
    } finally {
      setIsCreating(false);
      setCreationStatus('');
    }
  };

  return (
    <div className="h-screen overflow-y-hidden bg-[#fff] flex flex-col">
      {/* Navbar */}
      <Navbar />
      <div className="h-px bg-gray-200 w-full" />
      <div className="flex flex-row min-h-[calc(100vh-5rem)]">
        {/* Sidebar (below navbar) */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4 z-40">
          <nav className="flex flex-col gap-2">
            <div className="mb-6 text-xs text-gray-400 uppercase tracking-widest pl-2">Articles</div>
            {sidebarGroups.map((group) => (
              <button
                key={group.name}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition text-gray-700`}
              >
                <group.icon className="w-5 h-5" />
                {group.name}
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-8">
            <button className="w-full bg-[#48B85C] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#3da050] transition">
              {/* <PlusIcon className="w-5 h-5" /> */}
              New NBC Paper
            </button>
          </div>
        </aside>
        {/* Main content */}
        <div className="h-[calc(100vh-5rem)] overflow-y-auto flex-1 flex flex-col p-8 gap-8">
          {/* Page Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 60 }}
          >
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {documentType === 'market' ? 'Create New Market Report' : 'Create New NBC Paper'}
            </h1>
            <p className="text-gray-500 text-base max-w-2xl">
              {documentType === 'market' 
                ? 'Generate a comprehensive market report for the selected country. Provide the country information below to get started.'
                : 'Fill out the following steps to create a new NBC Paper. You\'ll provide basic project information, project details, and other relevant context. All fields are required unless marked optional.'
              }
            </p>
          </motion.div>
          <div className="flex flex-1 gap-8">
            {/* Stepper - Only show for NBC papers */}
            {documentType !== 'market' && (
              <motion.aside
                className="w-64 bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 60, delay: 0.1 }}
              >
                <ol className="space-y-8 w-full">
                  {steps.map((s, idx) => (
                    <li key={s.label} className="flex items-center gap-4">
                      <div className={`w-9 h-9 flex items-center justify-center rounded-full border-2 ${step === idx ? 'border-[#48B85C] bg-green-50 text-[#48B85C] font-bold' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>{idx + 1}</div>
                      <span className={`text-base ${step === idx ? 'text-[#48B85C] font-semibold' : 'text-gray-400'}`}>{s.label}</span>
                    </li>
                  ))}
                </ol>
              </motion.aside>
            )}
            {/* Form Card */}
            <motion.form
              onSubmit={handleSubmit}
              className={`bg-white rounded-xl border border-gray-100 p-8 ${documentType === 'market' ? 'flex-1 max-w-2xl' : 'flex-1 max-w-2xl'}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 60, delay: 0.2 }}
            >
              {isCreating ? (
                // Loading Component
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    {/* Main loading spinner */}
                    <div className="w-16 h-16 border-4 border-green-200 border-t-[#48B85C] rounded-full animate-spin mb-6"></div>
                    
                    {/* Pulsing background circle */}
                    <div className="absolute inset-0 w-16 h-16 bg-green-100 rounded-full animate-pulse opacity-50"></div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {documentType === 'market' ? 'Creating Market Report' : 'Creating NBC Paper'}
                  </h3>
                  <p className="text-gray-600 text-center mb-8 max-w-sm">{creationStatus}</p>
                  
                  {/* Progress steps */}
                  <div className="w-full max-w-md space-y-4">
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                      creationStatus.includes('Retrieving') ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        creationStatus.includes('Retrieving') ? 'bg-[#48B85C] text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {creationStatus.includes('Retrieving') ? '✓' : '1'}
                      </div>
                      <span className={`font-medium ${
                        creationStatus.includes('Retrieving') ? 'text-[#48B85C]' : 'text-gray-500'
                      }`}>
                        Retrieving relevant data
                      </span>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                      creationStatus.includes('Generating') ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        creationStatus.includes('Generating') ? 'bg-[#48B85C] text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {creationStatus.includes('Generating') ? '✓' : '2'}
                      </div>
                      <span className={`font-medium ${
                        creationStatus.includes('Generating') ? 'text-[#48B85C]' : 'text-gray-500'
                      }`}>
                        {documentType === 'market' ? 'Generating the market report' : 'Generating the NBC paper'}
                      </span>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                      creationStatus.includes('finishing') ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        creationStatus.includes('finishing') ? 'bg-[#48B85C] text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {creationStatus.includes('finishing') ? '✓' : '3'}
                      </div>
                      <span className={`font-medium ${
                        creationStatus.includes('finishing') ? 'text-[#48B85C]' : 'text-gray-500'
                      }`}>
                        Applying finishing touches
                      </span>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                      creationStatus.includes('Saving') ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        creationStatus.includes('Saving') ? 'bg-[#48B85C] text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {creationStatus.includes('Saving') ? '✓' : '4'}
                      </div>
                      <span className={`font-medium ${
                        creationStatus.includes('Saving') ? 'text-[#48B85C]' : 'text-gray-500'
                      }`}>
                        Saving to database
                      </span>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                      creationStatus.includes('Redirecting') ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        creationStatus.includes('Redirecting') ? 'bg-[#48B85C] text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {creationStatus.includes('Redirecting') ? '✓' : '5'}
                      </div>
                      <span className={`font-medium ${
                        creationStatus.includes('Redirecting') ? 'text-[#48B85C]' : 'text-gray-500'
                      }`}>
                        Redirecting to document
                      </span>
                    </div>
                  </div>
                  
                  {/* Estimated time */}
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">Estimated time: ~5-7 seconds</p>
                  </div>
                </div>
              ) : (
                <>
                  {documentType === 'market' ? (
                    // Market Report Form
                    <div className="space-y-6">
                      <h2 className="text-2xl font-extrabold text-gray-600 mb-6 pb-2 border-b border-gray-200">Market Report Information</h2>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Country</label>
                        <select
                          name="countryName"
                          value={marketForm.countryName}
                          onChange={handleMarketChange}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#48B85C] text-gray-800"
                        >
                          <option value="">Select Country</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>

                        {marketErrors.countryName && <div className="text-red-500 text-sm mt-1">{marketErrors.countryName}</div>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Year</label>
                        <input
                          type="number"
                          name="year"
                          value={marketForm.year}
                          onChange={handleMarketChange}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#48B85C] text-gray-800"
                        />
                        {/* {marketErrors.year && <div className="text-red-500 text-sm mt-1">{marketErrors.year}</div>} */}
                      </div>
                      
                      
                      {/* Submit button for market report */}
                      {submitError && <div className="text-red-500 text-sm mb-4">{submitError}</div>}
                      <div className="flex justify-end mt-8">
                        <button 
                          type="submit" 
                          disabled={isCreating}
                          className="px-6 py-2 rounded-lg bg-[#48B85C] text-white font-medium hover:bg-[#3da050] transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          {isCreating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Creating...
                            </>
                          ) : (
                            'Submit'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // NBC Paper Form - Step-based rendering
                    <div className="space-y-6">
                      <h2 className="text-2xl font-extrabold text-gray-600 mb-6 pb-2 border-b border-gray-200">
                        {step === 0 ? 'Basic Information' : 'Project Details'}
                      </h2>
                      
                      {step === 0 ? (
                        // Step 0: Basic Information
                        <div className="space-y-6">
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">Company Name *</label>
                            <input 
                              type="text" 
                              name="companyName" 
                              value={form.companyName} 
                              onChange={handleChange} 
                              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#48B85C] text-gray-800"
                              placeholder="Enter company name"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">Sector</label>
                            <input 
                              type="text" 
                              name="sector" 
                              value={form.sector} 
                              onChange={handleChange} 
                              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#48B85C] text-gray-800"
                              placeholder="Enter sector"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">Transaction Type *</label>
                            <input 
                              type="text" 
                              name="transactionType" 
                              value={form.transactionType} 
                              onChange={handleChange} 
                              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#48B85C] text-gray-800"
                              placeholder="Enter transaction type"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">Structuring Leads *</label>
                            {form.structuringLeads.map((lead, idx) => (
                              <input 
                                key={idx}
                                type="text" 
                                name={`structuringLeads[${idx}]`} 
                                value={lead} 
                                onChange={(e) => handleArrayChange('structuringLeads', idx, e.target.value)} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#48B85C] text-gray-800 mb-2"
                                placeholder="Enter structuring lead name"
                              />
                            ))}
                            <button 
                              type="button"
                              onClick={() => addArrayField('structuringLeads')} 
                              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition mt-2"
                            >
                              + Add Structuring Lead
                            </button>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">Sponsors *</label>
                            {form.sponsors.map((sponsor, idx) => (
                              <input 
                                key={idx}
                                type="text" 
                                name={`sponsors[${idx}]`} 
                                value={sponsor} 
                                onChange={(e) => handleArrayChange('sponsors', idx, e.target.value)} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#48B85C] text-gray-800 mb-2"
                                placeholder="Enter sponsor name"
                              />
                            ))}
                            <button 
                              type="button"
                              onClick={() => addArrayField('sponsors')} 
                              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition mt-2"
                            >
                              + Add Sponsor
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Step 1: Project Details
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-700 font-medium mb-1">Location *</label>
                              <input 
                                type="text" 
                                name="location" 
                                value={form.projectDetails.location} 
                                onChange={handleProjectDetailsChange} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#48B85C] text-gray-800"
                                placeholder="Enter project location"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-1">SDG Goal *</label>
                              <select
                                name="sdgGoal"
                                value={form.projectDetails.sdgGoal}
                                onChange={handleProjectDetailsChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#48B85C] text-gray-800"
                              >
                                <option value="">Select SDG Goal</option>
                                {SDG_GOALS.map(goal => (
                                  <option key={goal.number} value={goal.number}>{goal.number}. {goal.title}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-1">Tenor (years) *</label>
                              <input 
                                type="number" 
                                name="tenor" 
                                value={form.projectDetails.tenor} 
                                onChange={handleProjectDetailsChange} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#48B85C] text-gray-800"
                                placeholder="Enter tenor in years"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-1">Debt Need (USD) *</label>
                              <input 
                                type="number" 
                                name="debtNeed" 
                                value={form.projectDetails.debtNeed} 
                                onChange={handleProjectDetailsChange} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#48B85C] text-gray-800"
                                placeholder="Enter debt need in USD"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">Market Context</label>
                            <textarea 
                              name="marketContext" 
                              value={form.marketContext} 
                              onChange={handleChange} 
                              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#48B85C] text-gray-800"
                              rows={4}
                              placeholder="Describe the market context and background"
                            ></textarea>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">Due Diligence Flags</label>
                            {form.dueDiligenceFlags.map((flag, idx) => (
                              <input 
                                key={idx}
                                type="text" 
                                name={`dueDiligenceFlags[${idx}]`} 
                                value={flag} 
                                onChange={(e) => handleArrayChange('dueDiligenceFlags', idx, e.target.value)} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#48B85C] text-gray-800 mb-2"
                                placeholder="Enter due diligence flag"
                              />
                            ))}
                            <button 
                              type="button"
                              onClick={() => addArrayField('dueDiligenceFlags')} 
                              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition mt-2"
                            >
                              + Add Due Diligence Flag
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Step Navigation for NBC Papers */}
                      {documentType === 'nbc' && (
                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                          <button 
                            type="button"
                            onClick={handleBack} 
                            disabled={step === 0}
                            className={`px-6 py-2 rounded-lg font-medium transition ${
                              step === 0 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Back
                          </button>
                          
                          {step === 0 ? (
                            <button 
                              type="button"
                              onClick={handleNext} 
                              className="px-6 py-2 rounded-lg bg-[#48B85C] text-white font-medium hover:bg-[#3da050] transition"
                            >
                              Next
                            </button>
                          ) : (
                            <button 
                              onClick={handleSubmit}
                              type="submit" 
                              disabled={isCreating}
                              className="px-6 py-2 rounded-lg bg-[#48B85C] text-white font-medium hover:bg-[#3da050] transition disabled:opacity-50 flex items-center gap-2"
                            >
                              {isCreating ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Creating...
                                </>
                              ) : (
                                'Create NBC Paper'
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
}
