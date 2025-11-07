import { APP_NAME, APP_VERSION } from './app';
import { ROUTES } from './routes';

// Static content for the Settings > App Information section
// Keys map to local handlers in the Settings screen
export const APP_INFO_ITEMS = [
  {
    key: 'about',
    icon: 'information-circle-outline',
    title: 'About',
    subtitle: `${APP_NAME} v${APP_VERSION}`,
    route: ROUTES.ABOUT,
  },
  {
    key: 'terms',
    icon: 'document-text-outline',
    title: 'Terms & Conditions',
    subtitle: 'Read our terms of service',
    route: ROUTES.TERMS,
  },
  {
    key: 'privacy',
    icon: 'shield-checkmark-outline',
    title: 'Privacy Policy',
    subtitle: 'Learn about data privacy',
    route: ROUTES.PRIVACY,
  },
  {
    key: 'help',
    icon: 'help-circle-outline',
    title: 'Help & Support',
    subtitle: 'Get help and contact support',
    route: ROUTES.HELP,
  },
] as const;

export type AppInfoItemKey = typeof APP_INFO_ITEMS[number]['key'];
