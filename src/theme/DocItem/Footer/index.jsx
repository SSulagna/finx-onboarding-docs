import React from 'react';
import DocItemFooter from '@theme-original/DocItem/Footer';
import FeedbackWidget from '@site/src/components/FeedbackWidget';

export default function DocItemFooterWrapper(props) {
  return (
    <>
      <DocItemFooter {...props} />
      <FeedbackWidget />
    </>
  );
}
