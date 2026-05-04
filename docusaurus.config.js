// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'FinX Client Onboarding',
  tagline: 'Internal documentation for onboarding clients onto the FinX platform',
  favicon: 'img/favicon.ico',

  url: 'https://ssulagna.github.io',
  baseUrl: '/finx-onboarding-docs/',

  organizationName: 'SSulagna',
  projectName: 'finx-onboarding-docs',
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'warn',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: 'sandbox_notice',
        content:
          'FinX Onboarding Guide / Sandbox preview. Content is for review only and not an official release.',
        backgroundColor: '#fff4ce',
        textColor: '#5c4400',
        isCloseable: false,
      },
      navbar: {
        title: 'Client Onboarding',
        logo: {
          alt: 'FinX',
          src: 'img/finx-logo.svg',
        },
        items: [
          {
            to: '/docs/hub',
            label: 'Overview',
            position: 'right',
          },
          {
            to: '/docs/executive/brief',
            label: 'Executive Brief',
            position: 'right',
          },
          {
            to: '/docs/product-business/guide',
            label: 'Product & Business Guide',
            position: 'right',
          },
          {
            to: '/docs/engineering/architecture-overview',
            label: 'Engineering Guide',
            position: 'right',
          },
          {
            to: '/docs/partner-integration/auth-gateway',
            label: 'Partner Integration Guide',
            position: 'right',
          },
          {
            to: '/docs/qa-testing/test-strategy',
            label: 'QA & Testing Guide',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright:
          'FinX Internal Documentation. For authorized personnel only.',
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;
