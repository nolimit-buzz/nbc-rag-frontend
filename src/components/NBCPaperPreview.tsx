import React from 'react';

interface NBCPaperPreviewProps {
    data: {
        reference?: string;
        circulationDate?: string;
        structuringLead?: string;
        dealName?: string;
        sector?: string;
        transactionType?: string;
        sponsors?: string;
        companyDescription?: string;
        portfolioExposure?: {
            increase: string;
            total: string;
            limit: string;
        };
        // KYC Data
        organizationProfile?: {
            nameOfInstitution?: string;
            dateOfIncorporation?: string;
            natureOfBusiness?: string;
        };
        governance?: {
            directors?: string[];
            shareholding?: string;
        };
        flagReport?: {
            politicallyExposedPersons?: string;
            creditHistory?: string;
            flags?: string;
        };
        kycDocuments?: string[];
        date?: string;
    };
}

const NBCPaperPreview: React.FC<NBCPaperPreviewProps> = ({ data }) => {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 font-sans text-sm">
            {/* Main NBC Paper Table */}
            <h1 className="text-center text-[16px] font-bold mb-8 text-[#476f88]" style={{ marginBottom: '1.5rem' }}>New Business Committee Paper</h1>
            <div className="mb-8">
                <table className="w-full border-collapse">
                    <tbody>
                        <tr className="w-full">
                            <td className="w-max! max-w-max! p-2 font-semibold border border-gray-300 text-xs">Reference</td>
                            <td className="p-2 w-max! max-w-max! border border-gray-300 min-w-[370px]! text-xs">{data.reference || 'NB147'}</td>
                            <td className="p-2 border border-gray-300 text-xs" rowSpan={2} colSpan={3}>Portfolio Exposure (NGN)</td>
                        </tr>
                        <tr>
                            <td className="min-w-[155px]! max-w-max! p-2 font-semibold border border-t-0 border-gray-300 text-xs">Circulation Date</td>
                            <td className="p-2 border border-t-0 border-gray-300 text-xs">{data.circulationDate || '24 March 2025'}</td>
                        </tr>
                        <tr>
                            <td className="w-max! p-2 font-semibold border border-t-0 border-gray-300 text-xs">Structuring Lead</td>
                            <td className="p-2 border border-t-0 border-x-0 border-gray-300 text-xs">{data.structuringLead || 'Samuel Adeogun'}</td>
                            <td className="p-2 w-max! max-w-max! border border-gray-300 border-t-0 text-xs">Increase</td>
                            <td className="p-2 w-max! max-w-max! border border-gray-300 border-t-0 text-xs">Total</td>
                            <td className="p-2 w-max! max-w-max! border border-gray-300 border-t-0 text-xs">Limit</td>

                        </tr>
                        <tr>
                            <td className="w-max! p-2 font-semibold border border-t-0 border-gray-300 text-xs">Deal Name</td>
                            <td className="p-2 border border-t-0 border-x-0 border-gray-300 text-xs">
                                {data.dealName || 'CrossBoundary Energy'}
                            </td>
                            <td className="border border-gray-300 p-1 text-center border-t-0 text-xs">{data.portfolioExposure?.increase || '24.6 Bln'}</td>
                            <td className="border border-gray-300 p-1 text-center border-t-0 text-xs">{data.portfolioExposure?.total || '24.6 Bln'}</td>
                            <td className="border border-gray-300 p-1 text-center border-t-0 text-xs">{data.portfolioExposure?.limit || '116.9 Bln#'}</td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-t-0 border-gray-300 text-xs">Sector</td>
                            <td className="w-1/5 p-2 border border-t-0 border-x-0 border-gray-300 text-xs">
                                {data.sector || 'Renewable Energy'}
                            </td>
                            <td className="border border-gray-300 p-1 text-center border-t-0 text-xs">{data.portfolioExposure?.increase || '24.6 Bln'}</td>
                            <td className="border border-gray-300 p-1 text-center border-t-0 text-xs">{data.portfolioExposure?.total || '24.6 Bln'}</td>
                            <td className="border border-gray-300 p-1 text-center border-t-0 text-xs">{data.portfolioExposure?.limit || '116.9 Bln#'}</td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-t-0 border-gray-300 text-xs">Transaction Type</td>
                            <td className="w-1/5 p-2 border border-t-0 border-x-0 border-gray-300 text-xs">{data.transactionType || 'Direct Guarantee'}</td>
                            <td className="border border-gray-300 p-1 text-center text-xs" colSpan={3}>Based on USD202 million total capital with paid-in capital from InfraCo Africa, NSIA, and AFC; and a 10-year bond tenor</td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-t-0 border-gray-300 text-xs">Sponsors</td>
                            <td className="w-1/5 p-2 border border-t-0 border-gray-300 border-l-0 text-xs" colSpan={4}>{data.sponsors || 'CrossBoundary Energy Holdings – 100%'}</td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-t-0 border-gray-300 align-top text-xs">Company Description</td>
                            <td className="w-1/5 p-2 border border-t-0 border-gray-300 border-l-0 text-xs" colSpan={4}>
                                <div className="text-xs leading-relaxed">
                                    {data.companyDescription || `CrossBoundary Energy Telecom Solutions Nigeria Limited ("CBET" or the "Company") is a special purpose vehicle created by CrossBoundary Energy ("CBE") (https://crossboundaryenergy.com/) to construct and operate hybrid renewable energy solutions for telecommunication tower companies (TowerCos) in Africa.

CBE currently owns and operates a portfolio of solar power purchase agreements (PPAs) worth US$450 million with private companies, including Unilever, FG Gold, Nigerian Breweries, Zoodlabs, and Guinness Ghana, among others.

CBET serves TowerCos by providing reliable, energy-efficient, cost-effective, and environmentally friendly solutions that power telecom equipment in unserved and underserved communities where the electric grid is either nonexistent (off-grid) or only partially available and unreliable.

In line with CBET's expansion program, the Company is finalising a 10-year Energy Service Agreement ("ESA") with IHS towers (https://www.ihstowers.com/)² — the largest independent owner, operator, and developer of shared communication infrastructure in Nigeria.

The ESA follows the successful completion of four (4) proof of concept ("POC") sites located across Lagos, Edo, Kano states, and the Federal Capital Territory (FCT).

Upon finalisation and execution of the ESA, CBET intends to deploy its renewable energy solutions across 425 IHS tower sites in Nigeria (the "Project³"), with the potential to extend the service to additional sites, subject to performance and mutually agreeable terms.

Details of the off-take arrangement for the proposed Project are presented below:`}
                                </div>

                                {/* Off-taker Table */}
                                <div className="mt-4">
                                    <div className="font-semibold mb-2">Table 1: Selected Off-taker(s)</div>
                                    <table className="w-full text-xs border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-300 p-2 text-left text-xs">S/N</th>
                                                <th className="border border-gray-300 p-2 text-left text-xs">Off-taker(s)</th>
                                                <th className="border border-gray-300 p-2 text-left text-xs">Location</th>
                                                <th className="border border-gray-300 p-2 text-left text-xs">Tenor of off-take</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-300 p-2 text-xs">1.</td>
                                                <td className="border border-gray-300 p-2 text-xs">IHS Towers</td>
                                                <td className="border border-gray-300 p-2 text-xs">Kogi, Ondo, Niger, Kwara, Osun, Nasarawa, Edo, Oyo states and the FCT</td>
                                                <td className="border border-gray-300 p-2 text-xs">10 years</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="w-5/6 p-2 font-semibold border border-t-0 border-gray-300 align-top text-xs">Key Strengths</td>
                            <td className="w-1/6 p-2 border border-t-0 border-gray-300 border-l-0 text-xs" colSpan={4}>
                                <ul className="text-xs list-disc list-inside space-y-1">
                                    <li>Essentiality of service – provision of power to telecommunication tower sites;</li>
                                    <li>Long-term contractual off-take arrangement, with a blue-chip and credit-worthy counterparty – i.e., IHS Towers, the largest tower operator in the country;</li>
                                    <li>Potential collaboration with British International Investment (BII) to provide counter-guarantees;</li>
                                    <li>Experienced team with hands-on knowledge of implementing similar projects;</li>
                                    <li>Scalable business model which is easily replicable in other locations and with other quality counterparties;</li>
                                    <li>Cost-effective and environmentally friendly in comparison to alternative power sources such as diesel, and petrol generators;</li>
                                    <li>Cost-reflective tariffs with clearly defined mechanism for inflation adjustment; and</li>
                                    <li>Long-term assets&apos; life of solar panels compared with existing energy sources.</li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td className="w-5/6 p-2 font-semibold border border-t-0 border-gray-300 text-xs">Contractual Status</td>
                            <td className="w-1/6 p-2 border border-t-0 border-gray-300 border-l-0 text-xs" colSpan={4}>Executed NDA, PIC received, and Guarantee Request Letter</td>
                        </tr>
                        <tr>
                            <td className="w-5/6 p-2 font-semibold border border-gray-300 text-xs">Our Guarantee</td>
                            <td className="w-1/6 p-2 border border-gray-300 text-xs" colSpan={4}>The Company is seeking to raise up to NGN24.6 billion to be backed by InfraCredit&apos;s Guarantee and BII, as Co-Guarantor (&quot;the Transaction&quot;).</td>
                        </tr>
                        <tr>
                            <td className="w-5/6 p-2 font-semibold border border-gray-300 text-xs">Expected Use of Proceeds</td>
                            <td className="w-1/6 p-2 border border-gray-300 text-xs" colSpan={4}>The proceeds of the proposed debt will be applied toward investment in the new equipment for the IHS ESA.</td>
                        </tr>
                        <tr>
                            <td className="w-5/6 p-2 font-semibold border border-gray-300 text-xs">Tenor</td>
                            <td className="w-1/6 p-2 border border-gray-300 text-xs" colSpan={4}>Up to 10 years</td>
                        </tr>
                        <tr>
                            <td className="w-5/6 p-2 font-semibold border border-gray-300 text-xs">Beneficiary</td>
                            <td className="w-1/6 p-2 border border-gray-300 text-xs" colSpan={4} >CrossBoundary Energy Telecom Solutions Nigeria Limited</td>
                        </tr>
                        <tr>
                            <td className="w-5/6 p-2 font-semibold border border-gray-300 text-xs">Initial E&S Categorisation</td>
                            <td className="w-1/6 p-2 border border-gray-300 text-xs" colSpan={4}>Category B – These risks are considered limited, site-specific, reversible, and readily mitigable based on internationally recognized technical and technological measures</td>
                        </tr>
                        <tr>
                            <td className="w-5/6 p-2 font-semibold border border-gray-300 text-xs">Policy Exceptions</td>
                            <td className="w-1/6 p-2 border border-gray-300 text-xs" colSpan={4}>There is no potential breach of our single obligor limit or sector limit</td>
                        </tr>
                        <tr>
                            <td className="w-5/6 p-2 font-semibold border border-gray-300 align-top text-xs">Development Impact</td>
                            <td className="w-1/6 p-2 border border-gray-300 text-xs" colSpan={4}>
                                <ul className="text-xs list-disc list-inside space-y-1">
                                    <li>SDG 7: Affordable and Clean Energy: The project will provide clean electricity access for CrossBoundary clients and telecom infrastructures, which will displace costs associated with diesel dependency by 10-15%;</li>
                                    <li>SDG 8: Decent Work and Economic Growth: The proposed project will create employment opportunities to stimulate economic growth in the project area; and</li>
                                    <li>SDG 13: Climate Action: This project will reduce reliance on diesel generators by an average of 70%. It is estimated to reduce 80,000 tonnes of CO2 emissions over 10 years.</li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Transaction Overview Section */}
            <div className="mb-8">
                <h3 className="font-semibold mb-2">1. Transaction Overview</h3>
                <p className="text-xs leading-relaxed">
                    CrossBoundary Energy Telecom Solutions Nigeria Limited is looking to raise up to NGN24.6 billion from BOI and/or via the capital market to support its planned investment in new equipment to fulfil/honour the terms of the IHS ESA, involving the provision of solar hybrid systems⁵ to existing tower sites owned and operated by IHS Towers with an initial roll-out of up to 425 sites.
                </p>
                <p className="text-xs mt-2">⁵with a major energy supply from solar systems deployed and minimal backup supply from diesel generators</p>
            </div>

            {/* Market Overview */}
            <div className="mb-8">
                <h3 className="font-semibold mb-2">2. Market Overview</h3>
                <div className="text-xs leading-relaxed space-y-2">
                                            <p>
                            Nigeria&apos;s aggregate local electricity demand is estimated at 180,000MW. However, available supply falls significantly short, with an installed capacity of c.11,000MW, only c.8,000MW operational, and just 3,000-4,500MW effectively reaching end-users due to grid constraints and system failures. The government privatized the electricity sector in 2013 to improve power supply.
                        </p>
                                            <p>
                            Only 40% of Nigeria&apos;s population has access to the national grid, which is unreliable. Businesses and households rely on diesel and petrol generators, generating over 20,000MW at an annual cost of US$9.2 billion (CAPEX and OPEX), according to a 2017 World Bank report. These solutions are expensive and environmentally damaging, underscoring the importance of renewable energy development as a cleaner, cost-effective alternative for extending power access to unserved and underserved communities.
                        </p>
                    <p>
                        53,460 base transceiver stations (BTS) were deployed in Nigeria between 2016-2020, estimated to use 1.25 million litres of diesel per day for operations. Adopting renewable energy solutions from companies like CBET, Arnergy, and Energy Vision reduces spiking operating costs and CO2 emissions associated with diesel-powered generators.
                    </p>
                </div>
            </div>

            {/* Critical Areas for Due Diligence */}
            <div className="mb-8">
                <h3 className="font-semibold mb-2">3. Critical areas for further Due Diligence</h3>
                <ul className="text-xs list-disc list-inside space-y-1 mb-4">
                    <li>Expected useful life of underlying project equipment/assets;</li>
                    <li>Analysis of the cost differential of the four (4) POC sites;</li>
                    <li>Sponsor&apos;s support for the project – timely dollar equity injection;</li>
                    <li>Technical validation of the Project cost;</li>
                </ul>
                <hr className="my-4" />
                <div className="text-xs space-y-1">
                    <p>⁶ Converted at NGN1,600/US$1</p>
                    <p>⁷ There will be no recourse to CBE on the Project</p>
                    <p>⁸ https://nairametrics.com/2021/01/23/53460-</p>
                    <p>⁹ https://businessday.ng/energy/article/firms</p>
                </div>
                <ul className="text-xs list-disc list-inside space-y-1 mt-4">
                    <li>Assessment of the Project&apos;s forecasted cash flow ability to service debt and ring-fencing in line with the project finance structure;</li>
                    <li>Review and confirmation of terms of the IHS ESA, including the evaluation of Service Level Agreements (SLAs), termination clauses, tenor, provisions for adjustable cost reflective tariffs, and payment assurance from the Sponsor;</li>
                    <li>Assessment of agreements with the EPC and O&M contractor, including backup arrangements for routine maintenance, overhauls, and refurbishment;</li>
                    <li>Procedure for procurement of equipment to mitigate the impact of FX changes;</li>
                    <li>Assessment of the ownership of the sponsor (CrossBoundary Energy), adequacy of governance, board structures and management and staffing plan for the Nigerian business;</li>
                    <li>Regulatory assessment – permits, licenses, and any necessary approvals to be obtained;</li>
                    <li>ESG considerations; and</li>
                    <li>Technology risk – asset longevity/obsolescence risk, power production, and storage capacity of the power assets (batteries).</li>
                </ul>
            </div>

            {/* KYC Report */}
            <div className="mb-8">
                <h2 className="font-bold text-center mb-4">Preliminary KYC REPORT</h2>
                <table className="w-full border-collapse">
                    <tbody>
                        {/* Organization Profile Section */}
                        <tr>
                            <td colSpan={2} className="bg-gray-200 p-2 font-semibold text-center border border-gray-300 text-xs">ORGANISATION PROFILE</td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-gray-300 text-xs">Name of Institution</td>
                            <td className="w-1/5 p-2 border border-gray-300">{data.organizationProfile?.nameOfInstitution || 'CrossBoundary Energy Telecom Solutions Nigeria Limited'}</td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-gray-300 text-xs">Date of Incorporation/Establishment</td>
                            <td className="w-1/5 p-2 border border-gray-300">{data.organizationProfile?.dateOfIncorporation || 'The Company was incorporated as a Private Company limited by shares on 15th May 2023 with company registration number - 6967799'}</td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-gray-300 text-xs">Nature of Business</td>
                            <td className="w-1/5 p-2 border border-gray-300">{data.organizationProfile?.natureOfBusiness || 'Provision of distributed solar energy generation solutions, trading and maintenance of solar panels and equipment, including import and export.'}</td>
                        </tr>

                        {/* Governance/Shareholding Section */}
                        <tr>
                            <td colSpan={2} className="bg-gray-200 p-2 font-semibold text-center border border-gray-300 text-xs">GOVERNANCE/ SHAREHOLDING.</td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-gray-300 text-xs">Directors</td>
                            <td className="w-1/5 p-2 border border-gray-300">
                                {data.governance?.directors ? (
                                    <ol className="list-decimal list-inside">
                                        {data.governance.directors.map((director, index) => (
                                            <li key={index}>{director}</li>
                                        ))}
                                    </ol>
                                ) : (
                                    <ol className="list-decimal list-inside">
                                        <li>Tilleard Mathew James</li>
                                        <li>Joubert Pieter Ian</li>
                                    </ol>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-gray-300 text-xs">Shareholding/Ownership structure</td>
                            <td className="w-1/5 p-2 border border-gray-300">{data.governance?.shareholding || 'The share capital of the Company is 100,000,000 divided into 100,000,000 Ordinary shares of N1 each: 1. CrossBoundary Energy Holdings [C137785]¹⁰ - 100,000,000.'}</td>
                        </tr>

                        {/* Flag Report Section */}
                        <tr>
                            <td colSpan={2} className="bg-gray-200 p-2 font-semibold text-center border border-gray-300 text-xs">FLAG REPORT</td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-gray-300 text-xs">Politically Exposed Person(s)</td>
                            <td className="w-1/5 p-2 border border-gray-300">{data.flagReport?.politicallyExposedPersons || 'NIL'}</td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-gray-300 text-xs">Credit History</td>
                            <td className="w-1/5 p-2 border border-gray-300">{data.flagReport?.creditHistory || 'Commercial No hit report'}</td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-gray-300 text-xs">Flags (CAC Portal, World Check, United Nations Security Council Sanctions List, European Union Sanctions List, Office of Foreign Assets Sanctions List, Office of Financial Sanctions Implementation List, Google)</td>
                            <td className="w-1/5 p-2 border border-gray-300">{data.flagReport?.flags || 'NIL'}</td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-gray-300 text-xs">Commentary/Recommendation</td>
                            <td className="w-1/5 p-2 border border-gray-300">NIL</td>
                        </tr>
                    </tbody>
                </table>

                {/* Footnote */}
                <p className="text-xs mt-2">¹⁰The shareholders of CrossBoundary Energy Holdings are: ARCH ARPF CBE HoldCo; KLP NORFUND INVESTMENTS AS; and CrossBoundary Energy Management.</p>
            </div>

            {/* KYC Documents Section */}
            <div className="mb-8">
                <div className="bg-gray-200 p-2 font-semibold text-center border border-gray-300 mb-4">KYC DOCUMENTS/INFORMATION</div>
                <table className="w-full border-collapse">
                    <tbody>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-gray-300 text-xs">Documents provided for the KYC</td>
                            <td className="w-1/5 p-2 border border-gray-300">
                                {data.kycDocuments ? (
                                    <ol className="list-decimal list-inside text-xs">
                                        {data.kycDocuments.map((doc, index) => (
                                            <li key={index}>{doc}</li>
                                        ))}
                                    </ol>
                                ) : (
                                    <ol className="list-decimal list-inside text-xs">
                                        <li>Certificate of Incorporation of CrossBoundary Energy Telecom Solutions Nigeria Limited dated 15th May 2023.</li>
                                        <li>Certified Extract of the Memorandum and Articles of Association of CrossBoundary Energy Telecom Solutions Nigeria Limited dated 17 May 2023.</li>
                                        <li>Certificate of Incorporation of CrossBoundary Energy Holdings (CBEH) dated 14 April 2016.</li>
                                        <li>CBEH Constitution executed 14 July 2022.</li>
                                        <li>Constitution of CrossBoundary Energy Management executed 20 October 2022.</li>
                                        <li>CTC of CBEH Register of Shareholders of Ordinary Shares generated on 17 July 2024.</li>
                                        <li>CTC of CBEH Register of Shareholders of Preference Shares generated on 17 July 2024.</li>
                                        <li>CTC of CrossBoundary Energy Management Register of Directors generated on 23 July 2024.</li>
                                        <li>CTC of CBEH Register of Directors as at 20 August 2024.</li>
                                        <li>CTC of CrossBoundary Energy Management&apos;s Register of Shareholders (Class A Shares) generated on 23 July 2024.</li>
                                        <li>CTC of CrossBoundary Energy Management&apos;s Register of Shareholders (Class B Shares) generated on 23 July 2024.</li>
                                        <li>CTC of CrossBoundary Energy Management&apos;s Register of Shareholders (Class D Shares) generated on 23 July 2024.</li>
                                    </ol>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="w-4/5 p-2 font-semibold border border-gray-300 text-xs">Date</td>
                            <td className="w-1/5 p-2 border border-gray-300">{data.date || '17 March 2025 (Updated 24 March 2025).'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NBCPaperPreview; 