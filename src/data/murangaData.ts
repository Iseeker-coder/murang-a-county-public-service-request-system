import { SubCountyData, RequestCategory } from '../types';

export const MURANGA_SUB_COUNTIES: SubCountyData[] = [
  {
    name: 'Kiharu',
    wards: ['Murang\'a Township', 'Mbiri', 'Mugoiri', 'Murarandia', 'Gaturi', 'Kahuhia'],
  },
  {
    name: 'Kangema',
    wards: ['Kangari', 'Kanyenyaini', 'Muguru', 'Rwathia'],
  },
  {
    name: 'Mathioya',
    wards: ['Gitugi', 'Kiru', 'Kamacharia'],
  },
  {
    name: 'Gatanga',
    wards: ['Kariara', 'Gatanga', 'Kihumbu-ini', 'Kakuzi/Mitubiri', 'Ithanga', 'Samuru'],
  },
  {
    name: 'Kandara',
    wards: ['Ng\'araria', 'Muruka', 'Kagundu-ini', 'Gaichanjiru', 'Ithiru', 'Ruchu'],
  },
  {
    name: 'Maragua',
    wards: ['Kimorori/Wempa', 'Makuyu', 'Kambiti', 'Kamahuha', 'Ichagaki', 'Nginda'],
  },
  {
    name: 'Kigumo',
    wards: ['Kahumbu', 'Kinyona', 'Kigumo', 'Muthithi'],
  },
];

export const CATEGORIES: { label: RequestCategory; description: string; icon: string; dept: string }[] = [
  {
    label: 'Street Lighting',
    description: 'Defective streetlights, dark public transit hubs, fallen lighting poles or solar failures.',
    icon: 'Lightbulb',
    dept: 'Infrastructure, Roads, Housing and Transport',
  },
  {
    label: 'Water & Sanitation',
    description: 'Broken water pipelines, untreated discharge, lack of municipal water supply, leakages.',
    icon: 'Droplets',
    dept: 'Water, Irrigation, Environment and Natural Resources',
  },
  {
    label: 'Roads & Infrastructure',
    description: 'Potholes, blocked drainage culverts, damaged bridges, unpaved feeder roads.',
    icon: 'Construction',
    dept: 'Infrastructure, Roads, Housing and Transport',
  },
  {
    label: 'Garbage & Environment',
    description: 'Illegal waste dumps, overflowing bins in markets, riverbank littering, public hazards.',
    icon: 'Trash2',
    dept: 'Water, Irrigation, Environment and Natural Resources',
  },
  {
    label: 'Public Health',
    description: 'Sub-county clinic shortages, health facility sanitation, vector control, food hygiene.',
    icon: 'HeartPulse',
    dept: 'Health and Sanitation',
  },
  {
    label: 'Agriculture & Livestock',
    description: 'Fertilizer subsidy queries, crop pest outbreaks, livestock veterinary inspection.',
    icon: 'Wheat',
    dept: 'Agriculture, Livestock and Cooperatives',
  },
  {
    label: 'Education & Bursary',
    description: 'ECDE center infrastructure, Nyota Zetu scholarship follow-up, vocational polytechnics.',
    icon: 'GraduationCap',
    dept: 'Education and Technical Training',
  },
  {
    label: 'Other County Services',
    description: 'Single business permits, land rates verification, physical planning, noise complaints.',
    icon: 'FileText',
    dept: 'Public Service, ICT and Administration',
  },
];

export const COUNTY_DEPARTMENTS = [
  'Infrastructure, Roads, Housing and Transport',
  'Water, Irrigation, Environment and Natural Resources',
  'Health and Sanitation',
  'Agriculture, Livestock and Cooperatives',
  'Trade, Industrialization and Tourism',
  'Education and Technical Training',
  'Finance and Economic Planning',
  'Public Service, ICT and Administration',
  'Lands, Physical Planning and Urban Development',
  'Youth Affairs, Culture and Social Services',
  'Governance and Administration',
];
