import React from 'react';
import Root from '@theme-original/Root';
import FeedbackWidget from '@site/src/components/FeedbackWidget';

export default function RootWrapper(props) {
  return (
    <>
      <Root {...props} />
      <FeedbackWidget />
    </>
  );
}
