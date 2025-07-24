import { DocumentTextIcon, PencilSquareIcon, ClockIcon, CheckCircleIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { NBCPaper } from './interfaces';

const COUNTRIES = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad',
  'Comoros', 'Congo', 'Democratic Republic of the Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon',
  'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar',
  'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda',
  'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo',
  'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
];

const sidebarGroups = [
    { name: 'All Papers', icon: DocumentTextIcon, link: '/dashboard/papers/all' },
    { name: 'Drafts', icon: PencilSquareIcon, link: '/dashboard/papers/drafts' },
    { name: 'Pending Review', icon: ClockIcon, link: '/dashboard/papers/pending-review' },
    { name: 'Approved', icon: CheckCircleIcon, link: '/dashboard/papers/approved' },
    { name: 'Archived', icon: ArchiveBoxIcon, link: '/dashboard/papers/archived' },
    { name: 'Templates', icon: DocumentTextIcon, link: '/dashboard/templates' },
  ];
  const getStatCards = (nbcPapers: NBCPaper[]) => [
    {
      title: 'All Papers',
      value: nbcPapers.length,
      subtitle: 'Every business paper in your pipeline',
      description: 'Track your progress from draft to approval',
      backgroundColor: 'rgba(69, 206, 227, 0.4)',
      borderColor: 'rgba(69, 206, 227, 0.4)',
      badgeBackgroundColor: 'rgba(63, 195, 214, 0.4)',
      badgeTextColor: 'rgba(55, 65, 81, 0.8)'
    },
    {
      title: 'Drafts in Progress',
      value: nbcPapers.filter(p => p.metadata.status === 'draft').length,
      subtitle: 'Papers being written or edited',
      description: 'Keep refining your drafts for submission',
      backgroundColor: 'rgba(106, 156, 220, 0.4)',
      borderColor: 'rgba(106, 156, 220, 0.4)',
      badgeBackgroundColor: 'rgba(106, 156, 220, 0.4)',
      badgeTextColor: 'rgba(55, 65, 81, 0.8)'
    },
    {
      title: 'Awaiting Review',
      value: nbcPapers.filter(p => p.metadata.status === 'review' || p.metadata.status === 'pending').length,
      subtitle: 'Papers submitted for review',
      description: 'Monitor feedback and approval status',
      backgroundColor: 'rgba(71, 186, 235, 0.4)',
      borderColor: 'rgba(71, 186, 235, 0.4)',
      badgeBackgroundColor: 'rgba(63, 167, 209, 0.4)',
      badgeTextColor: 'rgba(55, 65, 81, 0.8)'
    },
    {
      title: 'Approved Papers',
      value: nbcPapers.filter(p => p.metadata.status === 'published' || p.metadata.status === 'approved').length,
      subtitle: 'Papers ready for next steps',
      description: 'Congratulations! These are ready to go',
      backgroundColor: 'rgba(53, 222, 177, 0.4)',
      borderColor: 'rgba(53, 222, 177, 0.4)',
      badgeBackgroundColor: 'rgba(47, 202, 161, 0.4)',
      badgeTextColor: 'rgba(55, 65, 81, 0.8)'
    } 
  ]
 const AFRICAN_COUNTRY_CODES = {
    "Algeria": "dz",
    "Angola": "ao",
    "Benin": "bj",
    "Botswana": "bw",
    "Burkina Faso": "bf",
    "Burundi": "bi",
    "Cabo Verde": "cv",
    "Cameroon": "cm",
    "Central African Republic": "cf",
    "Chad": "td",
    "Comoros": "km",
    "Congo (Brazzaville)": "cg",
    "Congo (Kinshasa)": "cd",
    "Cote d'Ivoire": "ci",
    "Djibouti": "dj",
    "Egypt": "eg",
    "Equatorial Guinea": "gq",
    "Eritrea": "er",
    "Eswatini": "sz",
    "Ethiopia": "et",
    "Gabon": "ga",
    "Gambia": "gm",
    "Ghana": "gh",
    "Guinea": "gn",
    "Guinea-Bissau": "gw",
    "Kenya": "ke",
    "Lesotho": "ls",
    "Liberia": "lr",
    "Libya": "ly",
    "Madagascar": "mg",
    "Malawi": "mw",
    "Mali": "ml",
    "Mauritania": "mr",
    "Mauritius": "mu",
    "Morocco": "ma",
    "Mozambique": "mz",
    "Namibia": "na",
    "Niger": "ne",
    "Nigeria": "ng",
    "Rwanda": "rw",
    "Sao Tome and Principe": "st",
    "Senegal": "sn",
    "Seychelles": "sc",
    "Sierra Leone": "sl",
    "Somalia": "so",
    "South Africa": "za",
    "South Sudan": "ss",
    "Sudan": "sd",
    "Tanzania": "tz",
    "Togo": "tg",
    "Tunisia": "tn",
    "Uganda": "ug",
    "Zambia": "zm",
    "Zimbabwe": "zw",
  }
  
  export { COUNTRIES, sidebarGroups, getStatCards, AFRICAN_COUNTRY_CODES};