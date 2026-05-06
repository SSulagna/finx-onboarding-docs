import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

const WEB3FORMS_ACCESS_KEY = 'd5ace1b5-e0de-49e0-b51f-e9834851e712';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(email) {
  if (!email) return 'Email is required.';
  if (!EMAIL_RE.test(email)) return 'Enter a valid email address (e.g. name@company.com).';
  return '';
}

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [pageTitle, setPageTitle] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const panelRef = useRef(null);

  useEffect(() => {
    setPageUrl(window.location.href);
    setPageTitle(document.title);
  }, []);

  /* Close panel when clicking outside */
  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* Reset form when panel re-opens */
  function handleOpen() {
    if (!open) {
      setName('');
      setEmail('');
      setEmailError('');
      setEmailTouched(false);
      setRating(0);
      setHovered(0);
      setMessage('');
      setStatus('idle');
    }
    setOpen((v) => !v);
  }

  function handleEmailBlur() {
    setEmailTouched(true);
    setEmailError(validate(email));
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    if (emailTouched) setEmailError(validate(e.target.value));
  }

  const canSubmit = rating > 0 && name.trim() && email && !validate(email);

  async function handleSubmit(e) {
    e.preventDefault();
    setEmailTouched(true);
    const err = validate(email);
    if (err) { setEmailError(err); return; }
    if (!canSubmit) return;

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `FinX Docs Feedback: ${pageTitle}`,
          from_name: name,
          name,
          email,
          rating: `${rating} out of 5 stars`,
          feedback: message || '(no comment)',
          page: pageUrl,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const displayRating = hovered || rating;

  return (
    <div className={styles.container} ref={panelRef}>
      {/* Floating panel */}
      <div className={`${styles.panel} ${open ? styles.panelOpen : ''}`} aria-hidden={!open}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Share feedback</span>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close feedback">✕</button>
        </div>

        {status === 'sent' ? (
          <div className={styles.thanks}>
            <span className={styles.thanksIcon}>✓</span>
            <div>
              <strong>Thank you!</strong>
              <p>Your feedback helps us improve the documentation.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Star rating */}
            <label className={styles.fieldLabel}>How helpful was this page?</label>
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
                >★</button>
              ))}
              {rating > 0 && <span className={styles.ratingLabel}>{['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}</span>}
            </div>

            {/* Name */}
            <label className={styles.fieldLabel} htmlFor="fb-name">Your name</label>
            <input
              id="fb-name"
              className={styles.input}
              type="text"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />

            {/* Email with validation */}
            <label className={styles.fieldLabel} htmlFor="fb-email">Your email</label>
            <input
              id="fb-email"
              className={`${styles.input} ${emailTouched && emailError ? styles.inputError : ''} ${emailTouched && !emailError && email ? styles.inputOk : ''}`}
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              required
              autoComplete="email"
            />
            {emailTouched && emailError && (
              <span className={styles.fieldError}>{emailError}</span>
            )}
            {emailTouched && !emailError && email && (
              <span className={styles.fieldOk}>Looks good!</span>
            )}

            {/* Comment */}
            <label className={styles.fieldLabel} htmlFor="fb-comment">Comments <span className={styles.optional}>(optional)</span></label>
            <textarea
              id="fb-comment"
              className={styles.textarea}
              placeholder="Corrections, suggestions, or anything else..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status === 'sending' || !canSubmit}
            >
              {status === 'sending' ? 'Sending…' : 'Send Feedback'}
            </button>

            {status === 'error' && (
              <span className={styles.errorMsg}>Something went wrong. Please try again.</span>
            )}
          </form>
        )}
      </div>

      {/* FAB trigger */}
      <button
        className={`${styles.fab} ${open ? styles.fabOpen : ''}`}
        onClick={handleOpen}
        aria-label="Open feedback form"
        aria-expanded={open}
      >
        <span className={styles.fabIcon}>{open ? '✕' : '★'}</span>
        <span className={styles.fabLabel}>{open ? 'Close' : 'Feedback'}</span>
      </button>
    </div>
  );
}
