/**
 * Navigation Configuration
 * Central config for all navigation menus
 */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  external?: boolean;
}

/**
 * Main navigation items
 */
export const mainNavigation: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'General Dentistry', href: '/services/general-dentistry' },
      { label: 'Dental Implants', href: '/services/dental-implants' },
      { label: 'CEREC Crowns', href: '/services/cerec-crowns' },
      { label: 'Teeth Cleaning', href: '/services/teeth-cleaning' },
      { label: 'Root Canal', href: '/services/root-canal' },
      { label: 'Pediatric Dentistry', href: '/services/pediatric-dentistry' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/**
 * Footer navigation sections
 */
export const footerNavigation = {
  services: [
    { label: 'General Dentistry', href: '/services/general-dentistry' },
    { label: 'Dental Implants', href: '/services/dental-implants' },
    { label: 'CEREC Crowns', href: '/services/cerec-crowns' },
    { label: 'Teeth Cleaning', href: '/services/teeth-cleaning' },
    { label: 'Root Canal', href: '/services/root-canal' },
    { label: 'Pediatric Dentistry', href: '/services/pediatric-dentistry' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Team', href: '/about#team' },
    { label: 'Contact', href: '/contact' },
    { label: 'Book Appointment', href: '/appointments' },
  ],
  resources: [
    { label: 'Learn', href: '/learn' },
    { label: 'Compare Treatments', href: '/compare' },
    { label: 'For Families', href: '/for/families' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
};

/**
 * Call-to-action button config
 */
export const ctaButton = {
  label: 'Book Appointment',
  href: '/appointments',
};
