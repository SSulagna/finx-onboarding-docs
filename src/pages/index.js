import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

const audiences = [
  {
    title: 'Executive',
    description: 'Strategy, milestones, risks, and business outcomes',
    href: '/docs/executive/brief',
  },
  {
    title: 'Product & Business Teams',
    description: 'Onboarding journey, modules, compliance touchpoints, user roles',
    href: '/docs/product-business/guide',
  },
  {
    title: 'Engineering Teams',
    description: 'Architecture, microservices, schema registry, APIs',
    href: '/docs/engineering/architecture-overview',
  },
  {
    title: 'Partners & Integrators',
    description: 'Authentication, API contracts, sandbox, integration model',
    href: '/docs/partner-integration/auth-gateway',
  },
];

function AudienceCard({ title, description, href }) {
  return (
    <Link to={href} className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{description}</p>
    </Link>
  );
}

export default function Home() {
  return (
    <Layout title="FinX Client Onboarding" description="Internal documentation for onboarding clients onto the FinX platform">
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>FinX Client Onboarding</h1>
        <p className={styles.heroSubtitle}>Internal documentation. Select your role to get started.</p>
      </header>
      <main>
        <section className={styles.cardsContainer}>
          {audiences.map((a) => (
            <AudienceCard key={a.title} {...a} />
          ))}
        </section>
        <section className={styles.secondarySection}>
          <h2 className={styles.secondaryTitle}>Looking for something specific?</h2>
          <ul className={styles.secondaryLinks}>
            <li><Link to="/docs/qa-testing/test-strategy">QA & Testing Guide</Link></li>
            <li><Link to="/docs/glossary">Glossary</Link></li>
            <li><Link to="/docs/hub">Hub Overview</Link></li>
          </ul>
        </section>
      </main>
    </Layout>
  );
}
