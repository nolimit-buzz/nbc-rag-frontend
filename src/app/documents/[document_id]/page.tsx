'use client'
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import dynamic from 'next/dynamic';
import { PencilSquareIcon, CheckIcon, PlusIcon, ArrowDownTrayIcon, PaperAirplaneIcon, ArrowPathIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";
import { usePDF } from 'react-to-pdf';
import Link from "next/dist/client/link";
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
interface Section {
  id: string;
  title: string;
  content: string;
  subsections?: Subsection[];
}

interface Subsection {
  title: string;
  htmlContent: string;
}

// Dynamic import for TiptapEditor with correct props
const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), { ssr: false });

export default function DocumentEditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const documentId = params.document_id as string;
  const documentType = searchParams.get('type');

  const [sections, setSections] = useState<Section[]>([]);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingSubsection, setEditingSubsection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('section-0');
  const [editContent, setEditContent] = useState<string>("");
  const [editSubsectionContent, setEditSubsectionContent] = useState<string>("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("NBC Paper");
  const [companyName, setCompanyName] = useState("");
  // New state for API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [structuringLeads, setStructuringLeads] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [projectDetails, setProjectDetails] = useState<string>('');
  const [sponsors, setSponsors] = useState<string>('');
  const [countryName, setCountryName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [year, setYear] = useState<string>('');
  // Preview mode state
  const [previewMode, setPreviewMode] = useState(false);

  // Submit for approval state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string>('');

  // Regenerate state
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [regeneratingSubsection, setRegeneratingSubsection] = useState<string | null>(null);
  const [regenerateStatus, setRegenerateStatus] = useState<string>('');

  // Menu dropdown state
  const [showMenu, setShowMenu] = useState(false);

  // Collapsed sections state
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
  } | null>(null);

  // PDF generation
  const { toPDF, targetRef } = usePDF({
    filename: `${titleInput.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_nbc_paper.pdf`,
    page: {
      margin: 30,
      format: 'a4',
      orientation: 'portrait'
    },
    method: 'save'
  });

  // Helper function to show notifications
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Helper to handle 401 Unauthorized
  function handleUnauthorized(res: Response) {
    if (res.status === 401) {
      localStorage.clear();
      router.push('/');
      return true;
    }
    return false;
  }

  // Toggle section collapse
  const toggleSectionCollapse = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Fetch NBC paper data
  useEffect(() => {
    console.log(documentId);
    const fetchNbcPaper = async () => {
      if (!documentId) return;

      try {
        setLoading(true);
        setError(null);

        const accessToken = localStorage.getItem('accessToken');

        // Determine the API endpoint based on document type
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const endpoint = documentType === 'market'
          ? `${baseUrl}/market-reports/${documentId}`
          : `${baseUrl}/nbc-papers/${documentId}`;

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (handleUnauthorized(response)) return;

        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status}`);
        }

        const data = await response.json();

        // Convert API response to sections format - handle new structure with content object
        let apiSections = [];

        apiSections = data.content
          .map((section: { title?: string; htmlContent?: string; subsections?: any[] }, index: number) => {
            return {
              id: `section-${index}`,
              title: section.title,
              content: section.htmlContent,
              subsections: section.subsections ? section.subsections.map((sub: any) => ({
                title: sub.title,
                htmlContent: sub.htmlContent
              })) : undefined
            };
          });
        setSections(apiSections);

        // Set active section to first section if available
        if (apiSections.length > 0) {
          setActiveSection(apiSections[0].id);
        }

        // Update title with paper title if available
        setTitleInput(data.title || "");
        setCompanyName(data.companyName || "");
        setCreatedAt(data.createdAt || "");
        setAuthor(data.author || "");
        setUpdatedAt(data.updatedAt || "");
        setStatus(data.status || "");
        setStructuringLeads(data.structuringLeads || "");
        setProjectDetails(data.projectDetails || "");
        setSponsors(data.sponsors || "");
        setCountryName(data.countryName || "");
        setDescription(data.description || "");
        setYear(data.year || "");
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NBC paper';
        setError(errorMessage);
        console.error('Error fetching NBC paper:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNbcPaper();
  }, [documentId, documentType,handleUnauthorized]);

  // When entering edit mode, set editContent to the section's content
  useEffect(() => {
    if (editingSection) {
      const section = sections.find(s => s.id === editingSection);
      setEditContent(section ? section.content : "");
    }
    // Ensure the first section is active by default if activeSection is not set
    if (!activeSection && sections.length > 0) {
      setActiveSection(sections[0].id);
    }
  }, [editingSection, sections, activeSection]);

  // Handler for saving edited content
  const handleSave = async (id: string) => {
    const section = sections.find(s => s.id === id);
    console.log("section", section);
    if (!section || !documentId) return;

    try {
      // Get the section key using the same function as regenerate
      const getSectionKey = (sectionTitle: string) => {
        switch (sectionTitle) {
          // NBC Paper sections
          case "Document Header & Summary Table":
            return "summary_table";
          case "Company & Project Overview":
            return "company_overview";
          case "Transaction Overview":
            return "transaction_overview";
          case "Market Overview":
            return "market_overview";
          case "Key Strengths & Value Proposition":
            return "key_strengths";
          case "Critical Areas for Due Diligence":
            return "critical_areas";
          case "Development Impact":
            return "development_impact";
          case "Initial Risk Assessment":
            return "initial_risk_assessment";
          case "Preliminary KYC Report":
            return "preliminary_kyc_report";
          // Market Report sections
          case "Summary Statistics":
            return "summary_statistics";
          case "Overview of Financial System":
            return "overview_financial_system";
          case "Bank and Non-Bank Financial Sector":
            return "bank_non_bank_financial_sector";
          case "Capital Market":
            return "capital_market";
          case "Fixed Income Markets":
            return "fixed_income_markets";
          case "Government Securities":
            return "government_securities";
          case "Non-Central Government Issuance":
            return "non_central_government_issuance";
          case "Secondary Market":
            return "secondary_market";
          case "Foreign Exchange":
            return "foreign_exchange";
          case "Derivatives":
            return "derivatives";
          case "Participation of Foreign Investors and Issuers":
            return "participation_foreign_investors_issuers";
          case "Clearing and Settlement":
            return "clearing_settlement";
          case "Investment Taxation":
            return "investment_taxation";
          case "Key Contacts":
            return "key_contacts";
          default:
            return sectionTitle;
        }
      };

      const sectionKey = getSectionKey(section.title);

      // Determine the API endpoint based on document type
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = documentType === 'market'
        ? `${baseUrl}/market-reports/${documentId}/sections/${sectionKey}`
        : `${baseUrl}/nbc-papers/${documentId}/sections/${sectionKey}`;
        const accessToken = localStorage.getItem('accessToken');

      // Send PUT request to update the section
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({
          title: section.title,
          htmlContent: editContent
        })
      });

      if (handleUnauthorized(response)) return;

      if (!response.ok) {
        throw new Error(`Failed to update section: ${response.status}`);
      }

      // Update local state
      setSections(sections.map(s => s.id === id ? { ...s, content: editContent } : s));
      setEditingSection(null);

      // Show success feedback
      showNotification('Section updated successfully!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update section';
      console.error('Error updating section:', err);
      showNotification(`Error: ${errorMessage}`, 'error');
    }
  };

  // Handler for saving subsection content
  const handleSaveSubsection = async (sectionId: string, subsectionIndex: number) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section || !documentId) return;

    const subsection = section.subsections?.[subsectionIndex];
    if (!subsection) return;

    try {
      const getSectionKey = (sectionTitle: string) => {
        switch (sectionTitle) {
          case "Snapshot":
            return "summary_statistics";
          case "Overview of Financial System":
            return "overview_of_financial_system";
          case "Bank and Non-Bank Financial Sector":
            return "bank_non_bank_financial_sector";
          case "Capital Market":
            return "capital_market";
          case "Fixed Income Markets":
            return "fixed_income_markets";
          case "Government Securities":
            return "government_securities";
          case "Non-Central Government Issuance":
            return "non_central_government_issuance";
          case "Secondary Market":
            return "secondary_market";
          case "Foreign Exchange":
            return "foreign_exchange";
          case "Derivatives":
            return "derivatives";
          case "Participation of Foreign Investors and Issuers":
            return "participation_foreign_investors_issuers";
          case "Clearing and Settlement":
            return "clearing_settlement";
          case "Investment Taxation":
            return "investment_taxation";
          case "Key Contacts":
            return "key_contacts";
          default:
            return sectionTitle;
        }
      };

      const sectionKey = getSectionKey(section.title);
      const subsectionKey = getSectionKey(subsection.title);

      // Determine the API endpoint based on document type
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = documentType === 'market'
        ? `${baseUrl}/market-reports/${documentId}/sections/${sectionKey}/subsections/${subsectionKey}`
        : `${baseUrl}/nbc-papers/${documentId}/sections/${sectionKey}/subsections/${subsectionKey}`;
      const accessToken = localStorage.getItem('accessToken');
      // Send PUT request to update the subsection
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({
          title: subsection.title,
          htmlContent: editSubsectionContent
        })
      });

      if (handleUnauthorized(response)) return;

      if (!response.ok) {
        throw new Error(`Failed to update subsection: ${response.status}`);
      }

      // Update local state
      setSections(sections.map(s => {
        if (s.id === sectionId) {
          const updatedSubsections = s.subsections?.map((sub, idx) =>
            idx === subsectionIndex ? { ...sub, htmlContent: editSubsectionContent } : sub
          );
          return { ...s, subsections: updatedSubsections };
        }
        return s;
      }));
      setEditingSubsection(null);

      // Show success feedback
      showNotification('Subsection updated successfully!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subsection';
      console.error('Error updating subsection:', err);
      showNotification(`Error: ${errorMessage}`, 'error');
    }
  };

  // Handler for downloading PDF with delay
  const handleDownloadPDF = () => {
    console.log('Starting PDF generation...');
    console.log('Sections:', sections);
    console.log('Target ref:', targetRef);
    console.log('Title:', titleInput);

    if (!sections || sections.length === 0) {
      alert('No content available to generate PDF. Please ensure the document has loaded properly.');
      return;
    }

    // Add a small delay to ensure content is fully rendered
    setTimeout(() => {
      console.log('Generating PDF...');
      toPDF();
    }, 500);
  };

  // Handler for submitting document for approval
  const handleSubmitForApproval = async () => {
    if (!documentId) return;

    setIsSubmitting(true);
    setSubmitStatus('Preparing submission...');

    try {
      // Simulate preparation step
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('Submitting for approval...');

      // Determine the API endpoint based on document type
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = documentType === 'market'
        ? `${baseUrl}/market-reports/${documentId}/submit`
        : `${baseUrl}/nbc-papers/${documentId}/submit`;
      const accessToken = localStorage.getItem('accessToken');
      // Submit to API
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({
          status: 'review',
          submittedAt: new Date().toISOString()
        })
      });

      if (handleUnauthorized(response)) return;

      if (!response.ok) {
        throw new Error(`Failed to submit document: ${response.status}`);
      }

      setSubmitStatus('Successfully submitted!');

      // Update local status
      setStatus('review');

      // Show success message
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitStatus('');
        showNotification('Document successfully submitted for approval!');
      }, 2000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit document';
      setSubmitStatus('Submission failed');
      console.error('Error submitting document:', err);

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitStatus('');
        showNotification(`Error: ${errorMessage}`, 'error');
      }, 2000);
    }
  };

  // Handler for regenerating a section
  const handleRegenerateSection = async (sectionTitle: string) => {
    if (!documentId) return;

    setRegeneratingSection(sectionTitle);
    setRegenerateStatus('Regenerating section...');

    try {
      const getSectionKey = (sectionTitle: string) => {
        switch (sectionTitle) {
          case "Document Header & Summary Table":
            return "summary_table";
          case "Company & Project Overview":
            return "company_overview";
          case "Transaction Overview":
            return "transaction_overview";
          case "Market Overview":
            return "market_overview";
          case "Key Strengths & Value Proposition":
            return "key_strengths";
          case "Critical Areas for Due Diligence":
            return "critical_areas";
          case "Development Impact":
            return "development_impact";
          case "Initial Risk Assessment":
            return "initial_risk_assessment";
          case "Preliminary KYC Report":
            return "preliminary_kyc_report";
          default:
            return sectionTitle;
        }
      }

      // Prepare the NBC paper object without content
      const nbcPaperWithoutContent = {
        title: titleInput,
        author: author,
        status: status,
        createdAt: createdAt,
        updatedAt: updatedAt,
        companyName: companyName,
        structuringLeads: structuringLeads,
        projectDetails: projectDetails,
        sponsors: sponsors,
      };
      const marketPaperWithoutContent = {
        title: titleInput,
        author: author,
        status: status,
        country: countryName,
        year: year,
        description: description,
      };
      console.log(getSectionKey(sectionTitle));

      // Determine the API endpoint based on document type
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = documentType === 'market'
        ? `${baseUrl}/market-reports/${documentId}/regenerate/`
        : `${baseUrl}/nbc-papers/${documentId}/regenerate`;
        const accessToken = localStorage.getItem('accessToken');

      // Send regenerate request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({
          sectionKey: getSectionKey(sectionTitle),
          [`${documentType}Paper`]: documentType === 'market' ? marketPaperWithoutContent : nbcPaperWithoutContent
        })
      });

      if (handleUnauthorized(response)) return;

      if (!response.ok) {
        throw new Error(`Failed to regenerate section: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      if (data.success && data.regeneratedSection) {
        // Update the section content with the regenerated content
        setSections(sections.map(s => {
          console.log("s.title", s.title, "sectionTitle", sectionTitle);
          return s.title === sectionTitle
            ? { ...s, content: data.regeneratedSection.htmlContent}
            : s
        }));

        setRegenerateStatus('Section regenerated successfully!');

        // Show success message
        setTimeout(() => {
          setRegeneratingSection(null);
          setRegenerateStatus('');
          showNotification('Section regenerated successfully!');
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to regenerate section');
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate section';
      setRegenerateStatus('Regeneration failed');
      console.error('Error regenerating section:', err);

      setTimeout(() => {
        setRegeneratingSection(null);
        setRegenerateStatus('');
        showNotification(`Error: ${errorMessage}`, 'error');
      }, 2000);
    }
  };

  // Handler for regenerating a subsection
  const handleRegenerateSubsection = async (sectionTitle: string, subsectionTitle: string) => {
    if (!documentId) return;

    setRegeneratingSubsection(`${sectionTitle}-${subsectionTitle}`);
    setRegenerateStatus('Regenerating subsection...');

    try {
      const getSectionKey = (sectionTitle: string) => {
        switch (sectionTitle) {
          // NBC Paper sections
          case "Document Header & Summary Table":
            return "summary_table";
          case "Company & Project Overview":
            return "company_overview";
          case "Transaction Overview":
            return "transaction_overview";
          case "Market Overview":
            return "market_overview";
          case "Key Strengths & Value Proposition":
            return "key_strengths";
          case "Critical Areas for Due Diligence":
            return "critical_areas";
          case "Development Impact":
            return "development_impact";
          case "Initial Risk Assessment":
            return "initial_risk_assessment";
          case "Preliminary KYC Report":
            return "preliminary_kyc_report";
          // Market Report sections
          case "Summary Statistics":
            return "summary_statistics";
          case "Overview of Financial System":
            return "overview_financial_system";
          case "Bank and Non-Bank Financial Sector":
            return "bank_non_bank_financial_sector";
          case "Capital Market":
            return "capital_market";
          case "Fixed Income Markets":
            return "fixed_income_markets";
          case "Government Securities":
            return "government_securities";
          case "Non-Central Government Issuance":
            return "non_central_government_issuance";
          case "Secondary Market":
            return "secondary_market";
          case "Foreign Exchange":
            return "foreign_exchange";
          case "Derivatives":
            return "derivatives";
          case "Participation of Foreign Investors and Issuers":
            return "participation_foreign_investors_issuers";
          case "Clearing and Settlement":
            return "clearing_settlement";
          case "Investment Taxation":
            return "investment_taxation";
          case "Key Contacts":
            return "key_contacts";
          default:
            return sectionTitle;
        }
      }

      // Prepare the paper object without content
      const nbcPaperWithoutContent = {
        title: titleInput,
        author: author,
        status: status,
        createdAt: createdAt,
        updatedAt: updatedAt,
        companyName: companyName,
        structuringLeads: structuringLeads,
        projectDetails: projectDetails,
        sponsors: sponsors,
      };
      const marketPaperWithoutContent = {
        title: titleInput,
        author: author,
        status: status,
        country: countryName,
        year: year,
        description: description,
      };

      const sectionKey = getSectionKey(sectionTitle);
      const subsectionKey = getSectionKey(subsectionTitle);

      console.log(`Regenerating subsection: ${sectionKey}/${subsectionKey}`);
      
      // Determine the API endpoint based on document type
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = documentType === 'market'
        ? `${baseUrl}/market-reports/${documentId}/regenerateSubsection`
        : `${baseUrl}/nbc-papers/${documentId}/regenerateSubsection`;
      const accessToken = localStorage.getItem('accessToken');
      // Send regenerate request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({
          sectionKey: sectionKey,
          subsectionKey: subsectionKey,
          [`${documentType}Paper`]: documentType === 'market' ? marketPaperWithoutContent : nbcPaperWithoutContent
        })
      });

      if (handleUnauthorized(response)) return;

      if (!response.ok) {
        throw new Error(`Failed to regenerate subsection: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      if (data.success && data.regeneratedSubsection) {
        // Update the subsection content with the regenerated content
        setSections(sections.map(s => {
          if (s.title === sectionTitle && s.subsections) {
            const updatedSubsections = s.subsections.map(sub =>
              sub.title === subsectionTitle
                ? { ...sub, htmlContent: data.regeneratedSubsection.htmlContent }
                : sub
            );
            return { ...s, subsections: updatedSubsections };
          }
          return s;
        }));

        setRegenerateStatus('Subsection regenerated successfully!');

        // Show success message
        setTimeout(() => {
          setRegeneratingSubsection(null);
          setRegenerateStatus('');
          showNotification('Subsection regenerated successfully!');
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to regenerate subsection');
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate subsection';
      setRegenerateStatus('Regeneration failed');
      console.error('Error regenerating subsection:', err);

      setTimeout(() => {
        setRegeneratingSubsection(null);
        setRegenerateStatus('');
        showNotification(`Error: ${errorMessage}`, 'error');
      }, 2000);
    }
  };
  return (
    <div className="h-screen overflow-y-hidden bg-[#ffffff]">
      {/* Navbar */}
      <Navbar />
      <div className="h-px bg-gray-200 w-full" />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#48B85C] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading NBC Paper...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center min-h-[400px]">
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

      {/* Main Content - Only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Profile Header - spans full width */}
          <div>
            <div className="w-full  overflow-y-auto flex items-center gap-4 bg-white p-6">
              <div className="w-12 h-12 rounded-full bg-[#48B85C] flex items-center justify-center text-2xl font-extrabold text-white">NB</div>
              <div>
                <div className="flex items-center gap-2">
                  {editingTitle ? (
                    <>
                      <input
                        className="text-lg font-semibold text-gray-800 border-b border-[#48B85C] focus:outline-none bg-transparent px-1 min-w-[500px] w-auto"
                        style={{ maxWidth: 400 }}
                        value={titleInput}
                        autoFocus
                        onChange={e => setTitleInput(e.target.value)}
                        onBlur={() => {
                          setEditingTitle(false);
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            setEditingTitle(false);
                          }
                        }}
                      />
                      <button
                        className="text-gray-400 hover:text-[#48B85C] cursor-pointer"
                        onMouseDown={e => { e.preventDefault(); setEditingTitle(false); }}
                      >
                        <CheckIcon className="w-5 h-5 cursor-pointer" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-lg font-semibold text-gray-800">{titleInput}</span>
                      <button
                        className="text-gray-400 hover:text-[#48B85C]"
                        onClick={() => { setEditingTitle(true); setTitleInput(titleInput); }}
                      >
                        <PencilSquareIcon className="w-5 h-5 cursor-pointer" />
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                  <span>ID: {documentId}</span>
                  {author && <span>Author: {author}</span>}
                  {status && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'draft' ? 'bg-[#1454D5] text-white' :
                      status === 'published' ? 'bg-green-100 text-green-800' :
                        status === 'review' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  )}
                  {createdAt && (
                    <span>
                      Created: {new Date(createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                  {updatedAt && updatedAt !== createdAt && (
                    <span>
                      Updated: {new Date(updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-4 py-2 rounded font-semibold transition flex items-center gap-2 cursor-pointer ${previewMode
                    ? 'bg-[#48B85C] text-white hover:bg-[#3da050]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {previewMode ? (
                    <>
                      <PencilSquareIcon className="w-4 h-4" />
                      Edit Mode
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      Preview Mode
                    </>
                  )}
                </button>
                {previewMode && (
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Download PDF
                  </button>
                )}
                {/* Menu Button */}
                <div className="relative z-[9999]">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
            <div className="h-px bg-gray-200 w-full" />
          </div>

          {/* Dropdown Menu - Fixed positioning outside any container */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="fixed top-40 right-8 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999]"
              >
                {/* Submit for Approval Option */}
                {status === 'draft' && !isSubmitting && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleSubmitForApproval();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <PaperAirplaneIcon className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Submit for Approval</div>
                      <div className="text-sm text-gray-500">Send document for review</div>
                    </div>
                  </button>
                )}

                {/* Submit Status Display */}
                {isSubmitting && (
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <div className="font-medium text-gray-900">Submitting...</div>
                      <div className="text-sm text-gray-500">{submitStatus}</div>
                    </div>
                  </div>
                )}

                {/* Download PDF Option */}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleDownloadPDF();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Download as PDF</div>
                    <div className="text-sm text-gray-500">Export document as PDF</div>
                  </div>
                </button>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2"></div>

                {/* New NBC Paper Option */}
                <Link
                  href="/documents/new"
                  className="block px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <PlusIcon className="w-5 h-5 text-[#48B85C]" />
                  <div>
                    <div className="font-medium text-gray-900">New NBC Paper</div>
                    <div className="text-sm text-gray-500">Create a new document</div>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close dropdown when clicking outside */}
          {showMenu && (
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setShowMenu(false)}
            />
          )}

          <div className="flex">
            {/* Sidebar - Hidden in preview mode */}
            {!previewMode && (
              <motion.aside
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
                className="lg:w-70 xl:w-96 bg-gray-50 border-r border-gray-200 flex flex-col py-8 px-6 min-h-screen"
              >
                <nav className="flex flex-col gap-6">
                  <div>
                    <div className="text-gray-700 font-semibold mb-6 flex items-center justify-between">
                      <span>Document Sections</span>
                    </div>
                    <AnimatePresence>
                      <ul className="list-none text-gray-500 text-sm pl-2 space-y-2">
                        {sections.map((section, idx) => (
                          <motion.li
                            key={section.id}
                            className={`relative cursor-pointer py-3 px-2 transition ${activeSection === section.id ? 'text-[#48B85C] font-semibold' : 'text-gray-700'}`}
                            onClick={() => {
                              setActiveSection(section.id);
                              // Smooth scroll to section within the main content area
                              const element = document.getElementById(`section-${section.id}`);
                              const mainContent = document.querySelector('main');
                              if (element && mainContent) {
                                // Calculate the offset to account for navbar and header
                                const navbarHeight = 80; // h-20 = 80px
                                const headerHeight = 130; // Profile header height
                                const totalOffset = navbarHeight + headerHeight;

                                const elementTop = element.offsetTop;
                                mainContent.scrollTo({
                                  top: elementTop - totalOffset,
                                  behavior: 'smooth'
                                });
                              }
                            }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: idx * 0.07, duration: 0.4, type: "spring", stiffness: 60 }}
                            whileHover={{
                              scale: 1.03,
                              color: "#48B85C"
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span>{section.title}</span>
                              {section.subsections && section.subsections.length > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSectionCollapse(section.id);
                                  }}
                                  className="ml-2 p-1 hover:bg-gray-100 rounded transition-transform duration-200"
                                >
                                  <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${collapsedSections.has(section.id) ? 'rotate-0' : 'rotate-90'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              )}
                            </div>

                            {/* Subsections */}
                            {section.subsections && section.subsections.length > 0 && (
                              <motion.div
                                initial={false}
                                animate={{
                                  height: collapsedSections.has(section.id) ? 0 : 'auto',
                                  opacity: collapsedSections.has(section.id) ? 0 : 1
                                }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <ul className="mt-2 space-y-1 pl-4 border-l-1 border-gray-200">
                                  {section.subsections.map((subsection, subIdx) => (
                                    <motion.li
                                      key={`${section.id}-sub-${subIdx}`}
                                      className={`py-2 px-3 text-xs transition ${activeSection === `${section.id}-sub-${subIdx}` ? 'text-[#48B85C] font-medium' : 'text-gray-500'}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveSection(`${section.id}-sub-${subIdx}`);
                                        // Smooth scroll to subsection
                                        const element = document.getElementById(`subsection-${section.id}-sub-${subIdx}`);
                                        const mainContent = document.querySelector('main');
                                        if (element && mainContent) {
                                          const navbarHeight = 80;
                                          const headerHeight = 130;
                                          const totalOffset = navbarHeight + headerHeight;
                                          const elementTop = element.offsetTop;
                                          mainContent.scrollTo({
                                            top: elementTop - totalOffset,
                                            behavior: 'smooth'
                                          });
                                        }
                                      }}
                                      whileHover={{
                                        scale: 1.02,
                                        color: "#48B85C"
                                      }}
                                    >
                                      {subsection.title}
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </motion.li>
                        ))}
                      </ul>
                    </AnimatePresence>
                  </div>
                </nav>
              </motion.aside>
            )}
            {/* Main Content */}
            <main className={`${previewMode ? 'flex-1' : 'flex-1'} p-12 bg-white h-[calc(100vh-168px)] overflow-y-auto`}>
              <div className={`${previewMode ? 'max-w-4xl mx-auto' : 'max-w-4xl mx-auto'} space-y-8`}>
                {previewMode ? (
                  // Preview Mode - Show all sections as a single document
                  <div
                    ref={targetRef}
                    className="pdf-target max-w-4xl mx-auto bg-white p-8"
                    style={{
                      minHeight: '100vh',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    {/* Document Header */}
                    <div className="text-center mb-12">
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">{titleInput}</h1>
                      <div className="text-gray-500 text-lg">NBC Paper</div>
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mt-2">
                        <span>ID: {documentId}</span>
                        {author && <span>Author: {author}</span>}
                        {status && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'draft' ? 'bg-[#1454D5] text-white' :
                            status === 'published' ? 'bg-green-100 text-green-800' :
                              status === 'review' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        )}
                        {createdAt && (
                          <span>
                            Created: {new Date(createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                        {updatedAt && updatedAt !== createdAt && (
                          <span>
                            Updated: {new Date(updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Document Content */}
                    <div className="space-y-8">
                      {sections.map((section, idx) => (
                        <motion.div
                          key={section.id}
                          id={`section-${section.id}`}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.15, duration: 0.6, type: "spring", stiffness: 60 }}
                          className="relative"
                        >
                          {/* Section Header with single color */}
                          <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-4 px-6 py-4 text-white bg-gray-800">
                              {section.title}
                            </h2>
                          </div>

                          {/* Section Content */}
                          <div className="text-gray-700 text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />

                          {/* Subsections */}
                          {section.subsections && section.subsections.length > 0 && (
                            <div className="mt-6 space-y-4">
                              {section.subsections.map((subsection, subIdx) => (
                                <motion.div
                                  key={`${section.id}-sub-${subIdx}`}
                                  id={`subsection-${section.id}-sub-${subIdx}`}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: (idx * 0.15) + (subIdx * 0.1), duration: 0.4 }}
                                  className="ml-6 pl-6 border-l-1 border-gray-300 bg-gray-50 rounded-r-lg p-4"
                                >
                                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    {subsection.title}
                                  </h3>
                                  <div className="text-gray-700 text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: subsection.htmlContent }} />
                                </motion.div>
                              ))}
                            </div>
                          )}

                          {/* Decorative element */}
                          {idx < sections.length - 1 && (
                            <div className="flex justify-center mt-8">
                              <div className="w-1 h-12 bg-gradient-to-b from-gray-200 to-transparent rounded-full"></div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Document Footer */}
                    <div className="mt-20 pt-8 border-t border-gray-200 text-center">
                      <div className="text-gray-500 text-sm">
                        Generated on {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit Mode - Show sections with edit functionality
                  sections.map((section, idx) => (
                    <motion.div
                      key={section.id}
                      id={`section-${section.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.025, boxShadow: "0 6px 32px 0 rgba(72, 184, 92, 0.10)" }}
                      transition={{ delay: idx * 0.07, duration: 0.4, type: "spring", stiffness: 60 }}
                      className='bg-gray-50 p-6 mb-4 rounded-xl flex flex-col gap-2 border border-gray-200 transition-all duration-200'
                      onClick={() => setActiveSection(section.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="font-semibold text-gray-700 flex-1">{section.title}</div>
                        <div className="flex items-center gap-1">
                          {regeneratingSection === section.title ? (
                            <div className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600">
                              <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              {regenerateStatus}
                            </div>
                          ) : (
                            <motion.button
                              className="text-blue-500 font-bold rounded p-1 cursor-pointer hover:text-blue-600"
                              onClick={e => { e.stopPropagation(); handleRegenerateSection(section.title); }}
                              whileHover={{ scale: 1.15, color: "#2563eb" }}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                              title="Regenerate section"
                            >
                              <ArrowPathIcon className="w-4 h-4" />
                            </motion.button>
                          )}
                          {editingSection === section.id ? (
                            <button
                              className="editor-save flex items-center gap-1 px-3 py-1 text-sm cursor-pointer"
                              onClick={e => { e.stopPropagation(); handleSave(section.id); }}
                            >
                              <CheckIcon className="w-5 h-5" /> Save
                            </button>
                          ) : (
                            <motion.button
                              className={`font-bold rounded p-1 transition ${regeneratingSection === section.id
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-400 cursor-pointer hover:text-[#48B85C]'
                                }`}
                              onClick={e => {
                                if (regeneratingSection !== section.id) {
                                  e.stopPropagation();
                                  // Clear any existing edit states before setting new one
                                  setEditingSection(section.id);
                                  setEditingSubsection(null);
                                }
                              }}
                              whileHover={regeneratingSection !== section.id ? { scale: 1.15, color: "#48B85C" } : {}}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                              disabled={regeneratingSection === section.id}
                            >
                              <PencilSquareIcon className={`${regeneratingSection === section.title ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 cursor-pointer hover:text-[#48B85C]'} w-5 h-5`} />
                            </motion.button>
                          )}
                        </div>
                      </div>
                      <AnimatePresence mode="wait" initial={false}>
                        {editingSection === section.id ? (
                          <motion.div
                            key="editor"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="relative"
                          >
                            {regeneratingSection === section.title && (
                              <div className="absolute inset-0 bg-gray-100 bg-opacity-50 z-10 flex items-center justify-center rounded-lg">
                                <div className="flex items-center gap-2 text-blue-600">
                                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-sm font-medium">Regenerating...</span>
                                </div>
                              </div>
                            )}
                            <div className={regeneratingSection === section.id ? 'pointer-events-none opacity-50' : ''}>
                              <TiptapEditor content={editContent} onChange={setEditContent} />
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="text-gray-700 text-sm prose max-w-none prose-p:my-2" dangerouslySetInnerHTML={{ __html: section.content }} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Subsections in Edit Mode */}
                      {section.subsections && section.subsections.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {section.subsections.map((subsection, subIdx) => (
                            <motion.div
                              key={`${section.id}-sub-${subIdx}`}
                              id={`subsection-${section.id}-sub-${subIdx}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (idx * 0.07) + (subIdx * 0.05), duration: 0.3 }}
                              className="ml-4 pl-4 border-l-1 border-gray-300 bg-gray-50 rounded-r-lg p-3"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex-1">
                                  {subsection.title}
                                </h4>
                                <div className="flex items-center gap-1">
                                  {regeneratingSubsection === `${section.title}-${subsection.title}` ? (
                                    <div className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600">
                                      <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                      {regenerateStatus}
                                    </div>
                                  ) : (
                                    <motion.button
                                      className="text-blue-500 font-bold rounded p-1 cursor-pointer hover:text-blue-600"
                                      onClick={e => { e.stopPropagation(); handleRegenerateSubsection(section.title, subsection.title); }}
                                      whileHover={{ scale: 1.15, color: "#2563eb" }}
                                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                      title="Regenerate subsection"
                                    >
                                      <ArrowPathIcon className="w-4 h-4" />
                                    </motion.button>
                                  )}
                                  {editingSubsection === `${section.id}-sub-${subIdx}` ? (
                                    <button
                                      className="editor-save flex items-center gap-1 px-2 py-1 text-xs cursor-pointer"
                                      onClick={e => { e.stopPropagation(); handleSaveSubsection(section.id, subIdx); }}
                                    >
                                      <CheckIcon className="w-4 h-4" /> Save
                                    </button>
                                  ) : (
                                    <motion.button
                                      className="text-gray-400 cursor-pointer hover:text-[#48B85C]"
                                      onClick={e => {
                                        e.stopPropagation();
                                        setEditingSection(null);
                                        setEditingSubsection(`${section.id}-sub-${subIdx}`);
                                        setEditSubsectionContent(subsection.htmlContent);
                                      }}
                                      whileHover={{ scale: 1.15, color: "#48B85C" }}
                                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    >
                                      <PencilSquareIcon className="w-4 h-4" />
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                              <AnimatePresence mode="wait" initial={false}>
                                {editingSubsection === `${section.id}-sub-${subIdx}` ? (
                                  <motion.div
                                    key="subsection-editor"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative"
                                  >
                                    <div className="scale-90 origin-top-left">
                                      <TiptapEditor content={editSubsectionContent} onChange={setEditSubsectionContent} />
                                    </div>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="subsection-view"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div className="text-gray-600 text-sm prose max-w-none prose-p:my-1" dangerouslySetInnerHTML={{ __html: subsection.htmlContent }} />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </main>
          </div>
        </>
      )}

      <style jsx global>{`
        /* PDF Generation - Comprehensive color function overrides */
        .pdf-target,
        .pdf-target * {
          /* Override all modern color functions with standard colors */
          color: #000000 !important;
          background-color: #ffffff !important;
          border-color: #e5e7eb !important;
          outline-color: #000000 !important;
          fill: #000000 !important;
          stroke: #000000 !important;
        }
        
        /* Specific element overrides */
        .pdf-target h1,
        .pdf-target h2,
        .pdf-target h3,
        .pdf-target h4,
        .pdf-target h5,
        .pdf-target h6 {
          color: #000000 !important;
        }
        
        .pdf-target p,
        .pdf-target div,
        .pdf-target span,
        .pdf-target li {
          color: #000000 !important;
        }
        
        /* Background overrides - but preserve headers */
        .pdf-target .bg-gray-800:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6),
        .pdf-target .bg-gray-700:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6),
        .pdf-target .bg-gray-600:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6),
        .pdf-target .bg-gray-500:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6),
        .pdf-target .bg-gray-400:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6),
        .pdf-target .bg-gray-300:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6),
        .pdf-target .bg-gray-200:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6),
        .pdf-target .bg-gray-100:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6),
        .pdf-target .bg-gray-50:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6) {
          background-color: #f3f4f6 !important;
        }
        
        /* Preserve header backgrounds */
        .pdf-target h1.bg-gray-800,
        .pdf-target h2.bg-gray-800,
        .pdf-target h3.bg-gray-800,
        .pdf-target h4.bg-gray-800,
        .pdf-target h5.bg-gray-800,
        .pdf-target h6.bg-gray-800 {
          background-color: #374151 !important;
          color: #ffffff !important;
        }
        
        .pdf-target .bg-white {
          background-color: #ffffff !important;
        }
        
        .pdf-target .bg-black {
          background-color: #000000 !important;
        }
        
        /* Text color overrides */
        .pdf-target .text-gray-900,
        .pdf-target .text-gray-800,
        .pdf-target .text-gray-700,
        .pdf-target .text-gray-600,
        .pdf-target .text-gray-500,
        .pdf-target .text-gray-400,
        .pdf-target .text-gray-300,
        .pdf-target .text-gray-200,
        .pdf-target .text-gray-100,
        .pdf-target .text-gray-50 {
          color: #374151 !important;
        }
        
        .pdf-target .text-white {
          color: #ffffff !important;
        }
        
        .pdf-target .text-black {
          color: #000000 !important;
        }
        
        /* Border overrides */
        .pdf-target .border-gray-200,
        .pdf-target .border-gray-300,
        .pdf-target .border-gray-400,
        .pdf-target .border-gray-500,
        .pdf-target .border-gray-600,
        .pdf-target .border-gray-700,
        .pdf-target .border-gray-800,
        .pdf-target .border-gray-900 {
          border-color: #e5e7eb !important;
        }
        
        .pdf-target .border-white {
          border-color: #ffffff !important;
        }
        
        .pdf-target .border-black {
          border-color: #000000 !important;
        }
        
        /* Remove any CSS custom properties that might contain modern color functions */
        .pdf-target {
          --tw-text-opacity: 1 !important;
          --tw-bg-opacity: 1 !important;
          --tw-border-opacity: 1 !important;
        }
        
        /* Comprehensive CSS reset for PDF generation */
        .pdf-target *,
        .pdf-target *::before,
        .pdf-target *::after {
          /* Reset all color-related properties */
          color: #000000 !important;
          background-color: #ffffff !important;
          border-color: #e5e7eb !important;
          outline-color: #000000 !important;
          fill: #000000 !important;
          stroke: #000000 !important;
          
          /* Remove any CSS custom properties */
          --tw-text-opacity: 1 !important;
          --tw-bg-opacity: 1 !important;
          --tw-border-opacity: 1 !important;
          --tw-shadow: none !important;
          --tw-ring-color: #000000 !important;
          
          /* Force standard colors */
          background-image: none !important;
          background-blend-mode: normal !important;
          mix-blend-mode: normal !important;
          
          /* Improve text wrapping and prevent cutoff */
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          hyphens: auto !important;
          line-height: 1.6 !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        
        /* Page break handling */
        .pdf-target h1,
        .pdf-target h2,
        .pdf-target h3,
        .pdf-target h4,
        .pdf-target h5,
        .pdf-target h6 {
          page-break-after: avoid !important;
          break-after: avoid !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          margin-bottom: 1em !important;
        }
        
        .pdf-target p,
        .pdf-target div,
        .pdf-target li {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          orphans: 3 !important;
          widows: 3 !important;
          margin-bottom: 0.5em !important;
        }
        
        .pdf-target table {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          margin-bottom: 1em !important;
        }
        
        /* Ensure proper spacing */
        .pdf-target {
          padding: 20px !important;
          line-height: 1.6 !important;
          font-size: 14px !important;
        }
        
        /* Table and List Styles for View Mode */
        .prose table {
          border-collapse: separate !important;
          border-spacing: 0 !important;
          margin: 1.5em 0 !important;
          overflow: hidden !important;
          table-layout: fixed !important;
          width: 100% !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 12px !important;
          background: white !important;
        }
        
        .prose table td,
        .prose table th {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          border-right: 1px solid #e5e7eb !important;
          box-sizing: border-box !important;
          min-width: 1em !important;
          padding: 16px 20px !important;
          position: relative !important;
          vertical-align: top !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
        }
        
        .prose table th {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
          font-weight: 600 !important;
          text-align: left !important;
          color: #374151 !important;
          font-size: 14px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          border-bottom: 2px solid #e5e7eb !important;
        }
        
        .prose table td {
          background-color: white !important;
          color: #4b5563 !important;
        }
        
        .prose table tr:last-child td {
          border-bottom: none !important;
        }
        
        .prose table td:last-child,
        .prose table th:last-child {
          border-right: none !important;
        }
        
        .prose table tr:hover td {
          background-color: #f9fafb !important;
          transition: background-color 0.2s ease !important;
        }
        
        .prose table p {
          margin: 0 !important;
        }
        
        /* List Styles for View Mode */
        .prose ul {
          list-style-type: disc !important;
          padding-left: 1.5em !important;
          margin: 1em 0 !important;
        }
        
        .prose ul li {
          display: list-item !important;
          list-style-type: disc !important;
          margin: 0.5em 0 !important;
          line-height: 1.6 !important;
        }
        
        .prose ol {
          list-style-type: decimal !important;
          padding-left: 1.5em !important;
          margin: 1em 0 !important;
        }
        
        .prose ol li {
          display: list-item !important;
          list-style-type: decimal !important;
         
          line-height: 1.6 !important;
        }
        
        .prose ul ul {
          list-style-type: circle !important;
          margin: 0.5em 0 !important;
        }
        
        .prose ul ul ul {
          list-style-type: square !important;
        }
        
        .prose ol ol {
          list-style-type: lower-alpha !important;
          margin: 0.5em 0 !important;
        }
        
        .prose ol ol ol {
          list-style-type: lower-roman !important;
        }
        
        /* PDF-specific list improvements */
        .pdf-target ul {
          list-style-position: outside !important;
          padding-left: 2em !important;
          margin: 1em 0 !important;
        }
        
        .pdf-target ul li {
          display: list-item !important;
          list-style-position: outside !important;
          margin: 0.5em 0 !important;
          line-height: 1.6 !important;
      }
        
        .pdf-target ol {
          list-style-position: outside !important;
          padding-left: 2em !important;
          margin: 1em 0 !important;
        }
        
        .pdf-target ol li {
          display: list-item !important;
         
          margin: 0.5em 0 !important;
          line-height: 1.6 !important;
        }
        
        .pdf-target ul ul {
          padding-left: 1.5em !important;
          margin: 0.5em 0 !important;
        }
        
        .pdf-target ol ol {
          padding-left: 1.5em !important;
          margin: 0.5em 0 !important;
        }
      `}</style>

      {/* Notification Component */}
      <AnimatePresence>
        {notification && notification.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg max-w-md mx-auto ${notification.type === 'success'
              ? 'bg-green-500 text-white'
              : notification.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-blue-500 text-white'
              }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === 'success' && (
                <CheckIcon className="w-5 h-5 flex-shrink-0" />
              )}
              {notification.type === 'error' && (
                <div className="w-5 h-5 flex-shrink-0 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-bold">!</span>
                </div>
              )}
              {notification.type === 'info' && (
                <div className="w-5 h-5 flex-shrink-0 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-bold">i</span>
                </div>
              )}
              <p className="text-sm font-medium">{notification.message}</p>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto text-white/80 hover:text-white transition-colors"
              >
                <div className="w-4 h-4">×</div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 