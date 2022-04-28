import React from 'react';
import {
  Posts,
  Header,
  LoadMore,
  EntryHeader,
  Footer,
  Main,
  SEO,
} from 'components';
import { pageTitle } from 'utils';

export default function Page() {
  return (
    <>
      <Header />

      <Main>
        <EntryHeader title="Latest Posts" />
        <div className="container"></div>
      </Main>

      <Footer />
    </>
  );
}
