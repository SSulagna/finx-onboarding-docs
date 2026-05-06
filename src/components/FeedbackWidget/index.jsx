import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

/**
 * To activate email delivery:
 * 1. Visit https://web3forms.com
 * 2. Enter sulagna.sasmal@ust.com — you'll receive an access key by email
 * 3. Replace the placeholder below with that key
 */
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

export default function FeedbackWidget() {
  const [pageUrl, setPageUrl] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  useEffect(() => {
    setPageUrl(window.location.href);
    setPageTitle(document.title);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return;
    setStatus('sending');

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `FinX Docs Feedback: ${pageTitle}`,
      from_name: name,
      name,
      email,
      rating: `${rating} out of 5 stars`,
      feedback: message || '(no comment)',
      page: pageUrl,
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setStatus(data.success ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const displayRating = hovered || rating;

  return (
    <div className={styles.widget}>
      <div className={styles.divider} />
      <p className={styles.label}>Was this page helpful?</p>

      {status === 'sent' ? (
        <div className={styles.thanks}>
          <span className={styles.thanksIcon}>✓</span>
          Thank you for your feedback — it helps us improve the documentation.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Star rating */}
          <div className={styles.stars} role="group" aria-label="Rate this page">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`${styles.star} ${displayRating >= n ? styles.starActive : ''}`}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(n)}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
            {rating > 0 && (
              <span className={styles.ratingLabel}>{rating} / 5</span>
            )}
          </div>

          {/* Name and email */}
          <div className={styles.row}>
            <input
              className={styles.input}
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className={styles.input}
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Free text */}
          <textarea
            className={styles.textarea}
            placeholder="Suggestions, corrections, or anything else..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />

          <div className={styles.footer}>
            <button
              type="submit"
              className={styles.submit}
              disabled={status === 'sending' || !rating || !name || !email}
            >
              {status === 'sending' ? 'Sending...' : 'Send Feedback'}
            </button>
            {status === 'error' && (
              <span className={styles.error}>Something went wrong. Please try again.</span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
