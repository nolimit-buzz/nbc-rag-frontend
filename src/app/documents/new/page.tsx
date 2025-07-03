"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, DocumentTextIcon, ArchiveBoxIcon, CheckCircleIcon, ClockIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Link from "next/link";

interface FormData {
  companyName: string;
  dealName: string;
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
  companyName: "",
  dealName: "",
  sector: "",
  transactionType: "",
  structuringLeads: [""],
  sponsors: [""],
  projectDetails: {
    location: "",
    sdgGoal: "",
    tenor: "",
    debtNeed: "",
  },
  marketContext: "",
  dueDiligenceFlags: [""]
};

const sidebarGroups = [
  { name: 'All Papers', icon: DocumentTextIcon },
  { name: 'Drafts', icon: PencilSquareIcon },
  { name: 'Pending Review', icon: ClockIcon },
  { name: 'Approved', icon: CheckCircleIcon },
  { name: 'Archived', icon: ArchiveBoxIcon },
  { name: 'Templates', icon: DocumentTextIcon },
];

export default function NewNBCPaper() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] = useState<string>('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field: keyof Pick<FormData, 'structuringLeads' | 'sponsors'>, idx: number, value: string) => {
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

  const addArrayField = (field: keyof Pick<FormData, 'structuringLeads' | 'sponsors'>) => {
    setForm((prev: FormData) => ({ ...prev, [field]: [...prev[field], ""] }));
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateStep()) return;
    
    setIsCreating(true);
    setCreationStatus('Retrieving relevant data...');
    
    try {
      // Simulate data retrieval step
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCreationStatus('Generating the NBC paper...');
      
      // Simulate generation step
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCreationStatus('Applying finishing touches...');
      
      // Simulate finalization step
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Format the body to match the required API structure
      const body = {
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
      
      setCreationStatus('Saving to database...');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nbc-papers/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      console.log(res);
      if (!res.ok) throw new Error('Failed to create NBC Paper');
      const data = await res.json();
      if (data.success && data.nbcPaper && data.nbcPaper.insertedId) {
        setCreationStatus('Redirecting to document...');
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(`/documents/${data.nbcPaper.insertedId}`);
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
      <nav className="top-0 left-0 right-0 z-30 h-20 bg-gray-50 shadow-sm flex items-center px-8">
        <Link href="/">
          <div className="flex items-center gap-2 mr-32">
            <p className="text-2xl font-bold text-gray-800">DIGI<span className="text-orange-700">CRED</span></p>
          </div>
        </Link>
        <div className="flex gap-10 text-gray-700 font-medium text-sm relative">
          {["Dashboard", "Cases", "Planning", "Evaluations"].map((item) => (
            <div key={item} className="relative flex flex-row items-center cursor-pointer">
              <a
                href={item === "Dashboard" ? "/" : item.toLowerCase()}
                className={`transition ${item === 'Dashboard' ? 'text-orange-700 font-semibold' : ''}`}
              >
                {item}
              </a>
              {item === 'Dashboard' && (
                <span className="ml-2 w-2 h-2 rounded-full bg-orange-700 inline-block align-middle" />
              )}
            </div>
          ))}
        </div>
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            placeholder="Search for an NBC Paper by Name..."
            className="w-[340px] rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-600"
          />
        </div>
        <div className="flex items-center gap-4 ml-8">
          <span className="text-gray-500 text-sm">Dr. Jefferson</span>
          <div className="w-9 h-9 rounded-full bg-orange-700 flex items-center justify-center text-lg font-extrabold text-white">SC</div>
        </div>
      </nav>
      <div className="h-px bg-gray-200 w-full" />
      <div className="flex flex-row min-h-[calc(100vh-5rem)]">
        {/* Sidebar (below navbar) */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4 z-40">
          <nav className="flex flex-col gap-2">
            <div className="mb-6 text-xs text-gray-400 uppercase tracking-widest pl-2">Articles</div>
            {sidebarGroups.map((group) => (
              <button
                key={group.name}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition text-gray-700`}
              >
                <group.icon className="w-5 h-5" />
                {group.name}
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-8">
            <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-orange-700 transition">
              <PlusIcon className="w-5 h-5" />
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
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create New NBC Paper</h1>
            <p className="text-gray-500 text-base max-w-2xl">Fill out the following steps to create a new NBC Paper. You&apos;ll provide basic project information, project details, and other relevant context. All fields are required unless marked optional.</p>
          </motion.div>
          <div className="flex flex-1 gap-8">
            {/* Stepper */}
            <motion.aside
              className="w-64 bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 60, delay: 0.1 }}
            >
              <ol className="space-y-8 w-full">
                {steps.map((s, idx) => (
                  <li key={s.label} className="flex items-center gap-4">
                    <div className={`w-9 h-9 flex items-center justify-center rounded-full border-2 ${step === idx ? 'border-orange-600 bg-orange-50 text-orange-600 font-bold' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>{idx + 1}</div>
                    <span className={`text-base ${step === idx ? 'text-orange-700 font-semibold' : 'text-gray-400'}`}>{s.label}</span>
                  </li>
                ))}
              </ol>
            </motion.aside>
            {/* Form Card */}
            <motion.form
              onSubmit={handleSubmit}
              className="flex-1 bg-white rounded-xl border border-gray-100 p-8 max-w-2xl"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 60, delay: 0.2 }}
            >
              {isCreating ? (
                // Loading Component
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    {/* Main loading spinner */}
                    <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-6"></div>
                    
                    {/* Pulsing background circle */}
                    <div className="absolute inset-0 w-16 h-16 bg-orange-100 rounded-full animate-pulse opacity-50"></div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Creating NBC Paper</h3>
                  <p className="text-gray-600 text-center mb-8 max-w-sm">{creationStatus}</p>
                  
                  {/* Progress steps */}
                  <div className="w-full max-w-md space-y-4">
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                      creationStatus.includes('Retrieving') ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        creationStatus.includes('Retrieving') ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {creationStatus.includes('Retrieving') ? '✓' : '1'}
                      </div>
                      <span className={`font-medium ${
                        creationStatus.includes('Retrieving') ? 'text-orange-700' : 'text-gray-500'
                      }`}>
                        Retrieving relevant data
                      </span>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                      creationStatus.includes('Generating') ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        creationStatus.includes('Generating') ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {creationStatus.includes('Generating') ? '✓' : '2'}
                      </div>
                      <span className={`font-medium ${
                        creationStatus.includes('Generating') ? 'text-orange-700' : 'text-gray-500'
                      }`}>
                        Generating the NBC paper
                      </span>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                      creationStatus.includes('finishing') ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        creationStatus.includes('finishing') ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {creationStatus.includes('finishing') ? '✓' : '3'}
                      </div>
                      <span className={`font-medium ${
                        creationStatus.includes('finishing') ? 'text-orange-700' : 'text-gray-500'
                      }`}>
                        Applying finishing touches
                      </span>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                      creationStatus.includes('Saving') ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        creationStatus.includes('Saving') ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {creationStatus.includes('Saving') ? '✓' : '4'}
                      </div>
                      <span className={`font-medium ${
                        creationStatus.includes('Saving') ? 'text-orange-700' : 'text-gray-500'
                      }`}>
                        Saving to database
                      </span>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                      creationStatus.includes('Redirecting') ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        creationStatus.includes('Redirecting') ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {creationStatus.includes('Redirecting') ? '✓' : '5'}
                      </div>
                      <span className={`font-medium ${
                        creationStatus.includes('Redirecting') ? 'text-orange-700' : 'text-gray-500'
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
                  {step === 0 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-extrabold text-gray-600 mb-6 pb-2 border-b border-gray-200">1. Basic Information</h2>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Company Name</label>
                        <input name="companyName" value={form.companyName} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-700 text-gray-800" />
                        {errors.companyName && <div className="text-red-500 text-sm mt-1">{errors.companyName}</div>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Transaction Type</label>
                        <input name="transactionType" value={form.transactionType} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-700 text-gray-800" />
                        {errors.transactionType && <div className="text-red-500 text-sm mt-1">{errors.transactionType}</div>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Structuring Leads</label>
                        <div className="flex flex-col gap-2 mb-2">
                          {form.structuringLeads.map((lead, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <input value={lead} onChange={e => handleArrayChange('structuringLeads', idx, e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-700 text-gray-800" />
                              <button
                                type="button"
                                className="p-1 text-gray-400 hover:text-red-600 transition cursor-pointer"
                                aria-label="Delete Lead"
                                onClick={() => setForm((prev: FormData) => ({
                                  ...prev,
                                  structuringLeads: prev.structuringLeads.filter((_, i: number) => i !== idx)
                                }))}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                              {errors.structuringLeads && errors.structuringLeads[idx] && <div className="text-red-500 text-sm mt-1">{errors.structuringLeads[idx]}</div>}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="flex items-center gap-1 border border-gray-400 text-gray-700 bg-white px-2 py-0.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition cursor-pointer mt-1"
                          onClick={() => addArrayField('structuringLeads')}
                        >
                          <span className="text-base font-normal">Add Lead +</span>
                        </button>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Sponsors</label>
                        <div className="flex flex-col gap-2 mb-2">
                          {form.sponsors.map((sponsor, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <input value={sponsor} onChange={e => handleArrayChange('sponsors', idx, e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-700 text-gray-800" />
                              <button
                                type="button"
                                className="p-1 text-gray-400 hover:text-red-600 transition cursor-pointer"
                                aria-label="Delete Sponsor"
                                onClick={() => setForm((prev: FormData) => ({
                                  ...prev,
                                  sponsors: prev.sponsors.filter((_, i: number) => i !== idx)
                                }))}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                              {errors.sponsors && errors.sponsors[idx] && <div className="text-red-500 text-sm mt-1">{errors.sponsors[idx]}</div>}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="flex items-center gap-1 border border-gray-400 text-gray-700 bg-white px-2 py-0.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition cursor-pointer mt-1"
                          onClick={() => addArrayField('sponsors')}
                        >
                          <span className="text-base font-normal">Add +</span>
                        </button>
                      </div>
                    </div>
                  )}
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 pb-2 border-b border-gray-200">2. Project Details</h2>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Location</label>
                        <input name="location" value={form.projectDetails.location} onChange={handleProjectDetailsChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-700 text-gray-800" />
                        {errors.location && <div className="text-red-500 text-sm mt-1">{errors.location}</div>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">SDG Goal</label>
                        <select
                          name="sdgGoal"
                          value={form.projectDetails.sdgGoal}
                          onChange={handleProjectDetailsChange}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-700 text-gray-800"
                        >
                          <option value="">Select SDG Goal</option>
                          <option value="No Poverty">1. No Poverty</option>
                          <option value="Zero Hunger">2. Zero Hunger</option>
                          <option value="Good Health and Well-being">3. Good Health and Well-being</option>
                          <option value="Quality Education">4. Quality Education</option>
                          <option value="Gender Equality">5. Gender Equality</option>
                          <option value="Clean Water and Sanitation">6. Clean Water and Sanitation</option>
                          <option value="Affordable and Clean Energy">7. Affordable and Clean Energy</option>
                          <option value="Decent Work and Economic Growth">8. Decent Work and Economic Growth</option>
                          <option value="Industry, Innovation and Infrastructure">9. Industry, Innovation and Infrastructure</option>
                          <option value="Reduced Inequalities">10. Reduced Inequalities</option>
                          <option value="Sustainable Cities and Communities">11. Sustainable Cities and Communities</option>
                          <option value="Responsible Consumption and Production">12. Responsible Consumption and Production</option>
                          <option value="Climate Action">13. Climate Action</option>
                          <option value="Life Below Water">14. Life Below Water</option>
                          <option value="Life on Land">15. Life on Land</option>
                          <option value="Peace, Justice and Strong Institutions">16. Peace, Justice and Strong Institutions</option>
                          <option value="Partnerships for the Goals">17. Partnerships for the Goals</option>
                        </select>
                        {errors.sdgGoal && <div className="text-red-500 text-sm mt-1">{errors.sdgGoal}</div>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Tenor</label>
                        <input name="tenor" value={form.projectDetails.tenor} onChange={handleProjectDetailsChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-700 text-gray-800" />
                        {errors.tenor && <div className="text-red-500 text-sm mt-1">{errors.tenor}</div>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Debt Need</label>
                        <input name="debtNeed" value={form.projectDetails.debtNeed} onChange={handleProjectDetailsChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-700 text-gray-800" />
                        {errors.debtNeed && <div className="text-red-500 text-sm mt-1">{errors.debtNeed}</div>}
                      </div>
                    </div>
                  )}
                  {/* Step 3 (Additional Information) is hidden for now */}
                  {/* Navigation Buttons */}
                  {submitError && <div className="text-red-500 text-sm mb-4">{submitError}</div>}
                  <div className="flex justify-between mt-8 gap-4">
                    <button type="button" onClick={handleBack} disabled={step === 0 || isCreating} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-500 bg-white font-medium disabled:opacity-50 cursor-pointer">Back</button>
                    {step < steps.length - 1 ? (
                      <button type="button" onClick={handleNext} disabled={isCreating} className="px-6 py-2 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 transition cursor-pointer disabled:opacity-50">Next Step</button>
                    ) : (
                      <button 
                        type="submit" 
                        disabled={isCreating}
                        className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
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
                    )}
                  </div>
                </>
              )}
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
} 