import React from 'react';
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

const AFRICAN_FLAGS: Record<string, React.FC> = {
  'Algeria': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#fff"/>
      <rect width="3" height="1" fill="#006233"/>
      <path d="M1.5 0.5 L2.2 0.8 L1.8 1.3 L1.2 1.3 L0.8 0.8 Z" fill="#d21034"/>
      <path d="M1.5 0.6 L1.8 0.8 L1.5 1.1 L1.2 0.8 Z" fill="#d21034"/>
    </svg>
  ),
  'Angola': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ff0000"/>
      <rect width="3" height="1" fill="#000000"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ffed00"/>
      <path d="M1.5 0.6 L1.7 0.75 L1.5 0.9 L1.3 0.75 Z" fill="#ffed00"/>
    </svg>
  ),
  'Benin': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="1.5" height="2" fill="#fcd116"/>
      <rect x="1.5" width="1.5" height="2" fill="#e8112d"/>
      <rect width="3" height="1" fill="#008751"/>
    </svg>
  ),
  'Botswana': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#75b2dd"/>
      <rect width="3" height="0.2" y="0.4" fill="#000000"/>
      <rect width="3" height="0.2" y="1.4" fill="#000000"/>
      <rect width="3" height="0.1" y="0.9" fill="#ffffff"/>
    </svg>
  ),
  'Burkina Faso': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#009e49"/>
      <rect width="3" height="1" fill="#ef3340"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ffed00"/>
    </svg>
  ),
  'Burundi': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <path d="M0 0 L3 0 L1.5 1 Z" fill="#00a651"/>
      <path d="M0 2 L3 2 L1.5 1 Z" fill="#00a651"/>
      <circle cx="1.5" cy="1" r="0.3" fill="#ffffff"/>
      <circle cx="1.5" cy="1" r="0.2" fill="#ce1126"/>
    </svg>
  ),
  'Cabo Verde': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#003f87"/>
      <rect width="3" height="0.4" y="0.8" fill="#ffffff"/>
      <rect width="3" height="0.4" y="1.2" fill="#ff0000"/>
      <circle cx="0.8" cy="1" r="0.3" fill="#ffed00"/>
    </svg>
  ),
  'Cameroon': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="1" height="2" fill="#007a5e"/>
      <rect x="1" width="1" height="2" fill="#ce1126"/>
      <rect x="2" width="1" height="2" fill="#fcd116"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ce1126"/>
    </svg>
  ),
  'Central African Republic': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="1" height="2" fill="#003f87"/>
      <rect x="1" width="1" height="2" fill="#ffffff"/>
      <rect x="2" width="1" height="2" fill="#ff0000"/>
      <rect x="1" width="1" height="2" fill="#ffed00"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ffed00"/>
    </svg>
  ),
  'Chad': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="1" height="2" fill="#002664"/>
      <rect x="1" width="1" height="2" fill="#ffed00"/>
      <rect x="2" width="1" height="2" fill="#c60c30"/>
    </svg>
  ),
  'Comoros': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#3a75c4"/>
      <rect width="3" height="0.5" y="0.75" fill="#ffed00"/>
      <rect width="3" height="0.5" y="1.25" fill="#ffffff"/>
      <rect width="3" height="0.5" y="1.75" fill="#ce1126"/>
      <path d="M0.5 0.5 L1.2 0.8 L0.8 1.3 L0.2 1.3 L-0.2 0.8 Z" fill="#ffffff"/>
    </svg>
  ),
  'Congo': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#009e60"/>
      <rect width="3" height="1" fill="#fbde4a"/>
      <rect width="3" height="0.5" y="0.75" fill="#dc241f"/>
    </svg>
  ),
  'Democratic Republic of the Congo': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#007934"/>
      <path d="M0 0 L3 0 L1.5 1 Z" fill="#fcd116"/>
      <path d="M0 2 L3 2 L1.5 1 Z" fill="#ce1126"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ffffff"/>
    </svg>
  ),
  'Djibouti': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#6ab2e7"/>
      <rect width="3" height="1" fill="#ffffff"/>
      <rect width="3" height="0.5" y="0.75" fill="#12ad2b"/>
      <path d="M0.5 0.5 L1.2 0.8 L0.8 1.3 L0.2 1.3 L-0.2 0.8 Z" fill="#d7141a"/>
    </svg>
  ),
  'Egypt': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.7" y="0.65" fill="#ffffff"/>
      <rect width="3" height="0.7" y="1.35" fill="#000000"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ce1126"/>
    </svg>
  ),
  'Equatorial Guinea': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#3c8d0d"/>
      <rect width="3" height="1" fill="#ffffff"/>
      <rect width="3" height="0.5" y="0.75" fill="#ce1126"/>
      <path d="M0.5 0.5 L1.2 0.8 L0.8 1.3 L0.2 1.3 L-0.2 0.8 Z" fill="#3c8d0d"/>
    </svg>
  ),
  'Eritrea': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.7" y="0.65" fill="#ffffff"/>
      <rect width="3" height="0.7" y="1.35" fill="#0066cc"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ce1126"/>
    </svg>
  ),
  'Eswatini': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.5" y="0.75" fill="#ffed00"/>
      <rect width="3" height="0.5" y="1.25" fill="#000000"/>
      <path d="M0.5 0.5 L1.2 0.8 L0.8 1.3 L0.2 1.3 L-0.2 0.8 Z" fill="#ffffff"/>
    </svg>
  ),
  'Ethiopia': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#009a49"/>
      <rect width="3" height="0.7" y="0.65" fill="#fcdd09"/>
      <rect width="3" height="0.7" y="1.35" fill="#ce1126"/>
      <circle cx="1.5" cy="1" r="0.3" fill="#0066cc"/>
    </svg>
  ),
  'Gabon': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#009e60"/>
      <rect width="3" height="0.7" y="0.65" fill="#fcd116"/>
      <rect width="3" height="0.7" y="1.35" fill="#3a75c4"/>
    </svg>
  ),
  'Gambia': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.4" y="0.8" fill="#ffffff"/>
      <rect width="3" height="0.4" y="1.2" fill="#3a75c4"/>
    </svg>
  ),
  'Ghana': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.7" y="0.65" fill="#fcd116"/>
      <rect width="3" height="0.7" y="1.35" fill="#006b3f"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ce1126"/>
    </svg>
  ),
  'Guinea': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="1" height="2" fill="#ce1126"/>
      <rect x="1" width="1" height="2" fill="#fcd116"/>
      <rect x="2" width="1" height="2" fill="#009e60"/>
    </svg>
  ),
  'Guinea-Bissau': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#fcd116"/>
      <rect width="1.5" height="2" fill="#ce1126"/>
      <path d="M0.5 0.5 L1.2 0.8 L0.8 1.3 L0.2 1.3 L-0.2 0.8 Z" fill="#000000"/>
    </svg>
  ),
  'Ivory Coast': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="1.5" height="2" fill="#f77f00"/>
      <rect x="1.5" width="1.5" height="2" fill="#ffffff"/>
      <rect x="3" width="1.5" height="2" fill="#009e60"/>
    </svg>
  ),
  'Kenya': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#000000"/>
      <rect width="3" height="0.2" y="0.4" fill="#ffffff"/>
      <rect width="3" height="0.2" y="1.4" fill="#ffffff"/>
      <rect width="3" height="0.1" y="0.9" fill="#ce1126"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ffffff"/>
    </svg>
  ),
  'Lesotho': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.5" y="0.75" fill="#ffffff"/>
      <rect width="3" height="0.5" y="1.25" fill="#0066cc"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#000000"/>
    </svg>
  ),
  'Liberia': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.2" y="0.4" fill="#ffffff"/>
      <rect width="3" height="0.2" y="1.4" fill="#ffffff"/>
      <rect width="3" height="0.1" y="0.9" fill="#ce1126"/>
      <path d="M0.5 0.5 L1.2 0.8 L0.8 1.3 L0.2 1.3 L-0.2 0.8 Z" fill="#ffffff"/>
    </svg>
  ),
  'Libya': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.5" y="0.75" fill="#ffffff"/>
      <rect width="3" height="0.5" y="1.25" fill="#000000"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ce1126"/>
    </svg>
  ),
  'Madagascar': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="2" height="2" fill="#ce1126"/>
      <rect x="2" width="1" height="2" fill="#ffffff"/>
      <rect x="2" width="1" height="1" fill="#0066cc"/>
    </svg>
  ),
  'Malawi': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.5" y="0.75" fill="#000000"/>
      <rect width="3" height="0.5" y="1.25" fill="#339e35"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ffffff"/>
    </svg>
  ),
  'Mali': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="1" height="2" fill="#ce1126"/>
      <rect x="1" width="1" height="2" fill="#fcd116"/>
      <rect x="2" width="1" height="2" fill="#009e60"/>
    </svg>
  ),
  'Mauritania': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.5" y="0.75" fill="#ffffff"/>
      <rect width="3" height="0.5" y="1.25" fill="#0066cc"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ce1126"/>
    </svg>
  ),
  'Mauritius': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.5" y="0.75" fill="#000000"/>
      <rect width="3" height="0.5" y="1.25" fill="#fcd116"/>
      <rect width="3" height="0.5" y="1.75" fill="#0066cc"/>
    </svg>
  ),
  'Morocco': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#006233"/>
    </svg>
  ),
  'Mozambique': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.5" y="0.75" fill="#ffffff"/>
      <rect width="3" height="0.5" y="1.25" fill="#000000"/>
      <path d="M0.5 0.5 L1.2 0.8 L0.8 1.3 L0.2 1.3 L-0.2 0.8 Z" fill="#fcd116"/>
    </svg>
  ),
  'Namibia': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.2" y="0.4" fill="#ffffff"/>
      <rect width="3" height="0.2" y="1.4" fill="#ffffff"/>
      <rect width="3" height="0.1" y="0.9" fill="#0066cc"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#fcd116"/>
    </svg>
  ),
  'Niger': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.5" y="0.75" fill="#ffffff"/>
      <rect width="3" height="0.5" y="1.25" fill="#009e60"/>
      <circle cx="1.5" cy="1" r="0.3" fill="#fcd116"/>
    </svg>
  ),
  'Nigeria': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="1" height="2" fill="#009e60"/>
      <rect x="1" width="1" height="2" fill="#ffffff"/>
      <rect x="2" width="1" height="2" fill="#009e60"/>
    </svg>
  ),
  'Rwanda': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.5" y="0.75" fill="#fcd116"/>
      <rect width="3" height="0.5" y="1.25" fill="#0066cc"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ffffff"/>
    </svg>
  ),
  'Sao Tome and Principe': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.5" y="0.75" fill="#ffffff"/>
      <rect width="3" height="0.5" y="1.25" fill="#0066cc"/>
      <path d="M0.5 0.5 L1.2 0.8 L0.8 1.3 L0.2 1.3 L-0.2 0.8 Z" fill="#fcd116"/>
    </svg>
  ),
  'Senegal': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="1" height="2" fill="#ce1126"/>
      <rect x="1" width="1" height="2" fill="#fcd116"/>
      <rect x="2" width="1" height="2" fill="#009e60"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ce1126"/>
    </svg>
  ),
  'Seychelles': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <path d="M0 0 L3 0 L1.5 1 Z" fill="#fcd116"/>
      <path d="M0 2 L3 2 L1.5 1 Z" fill="#ffffff"/>
      <path d="M0 0 L3 2 L1.5 1 Z" fill="#0066cc"/>
    </svg>
  ),
  'Sierra Leone': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.7" y="0.65" fill="#ffffff"/>
      <rect width="3" height="0.7" y="1.35" fill="#0066cc"/>
    </svg>
  ),
  'Somalia': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#ffffff"/>
    </svg>
  ),
  'South Africa': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.2" y="0.4" fill="#ffffff"/>
      <rect width="3" height="0.2" y="1.4" fill="#ffffff"/>
      <rect width="3" height="0.1" y="0.9" fill="#0066cc"/>
      <path d="M0 0 L1.5 1 L0 2 Z" fill="#009e60"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#fcd116"/>
    </svg>
  ),
  'South Sudan': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.2" y="0.4" fill="#ffffff"/>
      <rect width="3" height="0.2" y="1.4" fill="#ffffff"/>
      <rect width="3" height="0.1" y="0.9" fill="#0066cc"/>
      <path d="M0 0 L1.5 1 L0 2 Z" fill="#009e60"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#fcd116"/>
    </svg>
  ),
  'Sudan': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.5" y="0.75" fill="#ffffff"/>
      <rect width="3" height="0.5" y="1.25" fill="#000000"/>
      <path d="M0 0 L1.5 1 L0 2 Z" fill="#009e60"/>
    </svg>
  ),
  'Tanzania': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <path d="M0 0 L3 0 L1.5 1 Z" fill="#000000"/>
      <path d="M0 2 L3 2 L1.5 1 Z" fill="#009e60"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#fcd116"/>
    </svg>
  ),
  'Togo': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.2" y="0.4" fill="#ffffff"/>
      <rect width="3" height="0.2" y="1.4" fill="#ffffff"/>
      <rect width="3" height="0.1" y="0.9" fill="#009e60"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#fcd116"/>
    </svg>
  ),
  'Tunisia': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <circle cx="1.5" cy="1" r="0.4" fill="#ffffff"/>
      <path d="M1.5 0.7 L1.7 0.9 L1.5 1.1 L1.3 0.9 Z" fill="#ce1126"/>
    </svg>
  ),
  'Uganda': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.2" y="0.4" fill="#ffffff"/>
      <rect width="3" height="0.2" y="1.4" fill="#ffffff"/>
      <rect width="3" height="0.1" y="0.9" fill="#000000"/>
      <circle cx="1.5" cy="1" r="0.3" fill="#fcd116"/>
    </svg>
  ),
  'Zambia': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.5" y="0.75" fill="#000000"/>
      <rect width="3" height="0.5" y="1.25" fill="#009e60"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#fcd116"/>
    </svg>
  ),
  'Zimbabwe': () => (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ce1126"/>
      <rect width="3" height="0.2" y="0.4" fill="#ffffff"/>
      <rect width="3" height="0.2" y="1.4" fill="#ffffff"/>
      <rect width="3" height="0.1" y="0.9" fill="#000000"/>
      <path d="M0 0 L1.5 1 L0 2 Z" fill="#009e60"/>
      <path d="M1.5 0.5 L1.8 0.7 L1.5 0.9 L1.2 0.7 Z" fill="#fcd116"/>
    </svg>
  )
};

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
  export { COUNTRIES, sidebarGroups, getStatCards , AFRICAN_FLAGS};