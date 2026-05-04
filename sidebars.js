// @ts-check
// Sidebar configuration for FinX Client Onboarding docs.
// Categories use explicit labels; items are listed explicitly so that
// ordering and labels remain stable across content changes.

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Overview',
      collapsible: true,
      collapsed: false,
      items: ['hub'],
    },
    {
      type: 'category',
      label: 'Executive Brief',
      collapsible: true,
      collapsed: true,
      items: ['executive/brief'],
    },
    {
      type: 'category',
      label: 'Product & Business Guide',
      collapsible: true,
      collapsed: true,
      items: [
        'product-business/guide',
        'product-business/journey-map',
        'product-business/module-overview',
        'product-business/compliance-kyc',
      ],
    },
    {
      type: 'category',
      label: 'Engineering Guide',
      collapsible: true,
      collapsed: true,
      items: [
        'engineering/architecture-overview',
        'engineering/microservices-registry',
        'engineering/schema-registry-sop',
        'engineering/orchestration-engine',
        'engineering/api-reference',
      ],
    },
    {
      type: 'category',
      label: 'Partner Integration Guide',
      collapsible: true,
      collapsed: true,
      items: [
        'partner-integration/auth-gateway',
        'partner-integration/api-contracts',
        'partner-integration/sandbox-postman',
      ],
    },
    {
      type: 'category',
      label: 'QA & Testing Guide',
      collapsible: true,
      collapsed: true,
      items: [
        'qa-testing/test-strategy',
        'qa-testing/scenario-catalog',
        'qa-testing/environment-matrix',
      ],
    },
  ],
};

module.exports = sidebars;
