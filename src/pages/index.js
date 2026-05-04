import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const heroStyle = {
  background: 'linear-gradient(135deg, #0b1f3a 0%, #14375e 100%)',
  color: '#ffffff',
  padding: '5rem 1.5rem 4rem 1.5rem',
  textAlign: 'center',
};

const heroTitleStyle = {
  fontSize: '2.75rem',
  fontWeight: 700,
  margin: 0,
  letterSpacing: '-0.02em',
};

const heroSubtitleStyle = {
  fontSize: '1.25rem',
  marginTop: '0.75rem',
  opacity: 0.85,
  fontWeight: 400,
};

const cardsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '1.5rem',
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '3rem 1.5rem 5rem 1.5rem',
};

const cardStyle = {
  display: 'block',
  background: '#ffffff',
  border: '1px solid #e3e8ef',
  borderRadius: '8px',
  padding: '1.75rem 1.5rem',
  textDecoration: 'none',
  color: 'inherit',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
  transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
};

const cardLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#1f6feb',
  marginBottom: '0.5rem',
};

const cardTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: 600,
  margin: '0 0 0.5rem 0',
  color: '#0b1f3a',
};

const cardDescStyle = {
  fontSize: '0.95rem',
  color: '#475569',
  lineHeight: 1.5,
  margin: 0,
};

const audiences = [
  {
    label: 'Audience 01',
    title: 'Executive',
    description: 'Understand the onboarding journey at a business level',
    href: '/docs/executive/brief',
  },
  {
    label: 'Audience 02',
    title: 'Product & Business Teams',
    description:
      'Explore modules, workflows, and compliance touchpoints',
    href: '/docs/product-business/journey-map',
  },
  {
    label: 'Audience 03',
    title: 'Engineering Teams',
    description:
      'Architecture, APIs, microservices, and integration specs',
    href: '/docs/engineering/architecture-overview',
  },
  {
    label: 'Audience 04',
    title: 'Partners & Integrators',
    description:
      'Authentication, API contracts, sandbox environment',
    href: '/docs/partner-integration/auth-gateway',
  },
];

function AudienceCard({ label, title, description, href }) {
  const [hover, setHover] = React.useState(false);
  const dynamicStyle = hover
    ? {
        ...cardStyle,
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
        borderColor: '#1f6feb',
      }
    : cardStyle;

  return (
    <Link
      to={href}
      style={dynamicStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={cardLabelStyle}>{label}</div>
      <h3 style={cardTitleStyle}>{title}</h3>
      <p style={cardDescStyle}>{description}</p>
    </Link>
  );
}

export default function Home() {
  return (
    <Layout
      title="FinX Client Onboarding"
      description="Internal documentation for onboarding clients onto the FinX platform"
    >
      <header style={heroStyle}>
        <h1 style={heroTitleStyle}>FinX Client Onboarding</h1>
        <p style={heroSubtitleStyle}>Select your role to get started</p>
      </header>
      <main>
        <section style={cardsContainerStyle}>
          {audiences.map((a) => (
            <AudienceCard key={a.title} {...a} />
          ))}
        </section>
      </main>
    </Layout>
  );
}
