import homeContent from './content/home.md?raw';
import whoisdevContent from './content/whoisdev.md?raw';
import futureUpdatesContent from './content/future_updates.md?raw';
import privacyPolicyContent from './content/privacy_policy.md?raw';
import termsAndConditionsContent from './content/terms_and_conditions.md?raw';
import changelogContent from './content/changelog.md?raw';

export const docsConfig = [
  {
    id: "home",
    title: "Home",
    content: homeContent
  },
  {
    id: "whoisdev",
    title: "WHOisDEV?",
    content: whoisdevContent
  },
  {
    id: "future_updates",
    title: "Future Updates",
    content: futureUpdatesContent
  },
  {
    id: "privacy_policy",
    title: "Privacy Policy",
    content: privacyPolicyContent
  },
  {
    id: "terms_and_conditions",
    title: "Terms & Conditions",
    content: termsAndConditionsContent
  },
  {
    id: "changelog",
    title: "Changelog",
    content: changelogContent
  }
];
