import { DocumentTextIcon, PencilSquareIcon, ClockIcon, CheckCircleIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { NBCPaper } from './interfaces';

 const COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
    'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
    'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
    'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
    'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
    'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
    'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
    'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
    'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  const sidebarGroups = [
    { name: 'All Papers', icon: DocumentTextIcon },
    { name: 'Drafts', icon: PencilSquareIcon },
    { name: 'Pending Review', icon: ClockIcon },
    { name: 'Approved', icon: CheckCircleIcon },
    { name: 'Archived', icon: ArchiveBoxIcon },
    { name: 'Templates', icon: DocumentTextIcon },
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
  export { COUNTRIES, sidebarGroups, getStatCards };