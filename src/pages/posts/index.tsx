import React from 'react';
import { Posts, Header, EntryHeader, Footer, Main, SEO } from 'components';
import { withUrqlClient } from 'next-urql';
import type { Client } from 'urql';
import { dedupExchange, cacheExchange, fetchExchange, useQuery } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { pageTitle } from 'utils';
import appConfig from 'app.config';
import getNextStaticProps from 'helpers/getNextStaticProps';
import { POSTS_QUERY } from 'pages/index';

function Page() {
  const [{ data, fetching }] = useQuery({
    query: POSTS_QUERY,
    variables: { categoryName: 'uncategorized', first: appConfig.postsPerPage },
  });
  const posts = !fetching ? data.posts : {};
  return (
    <>
      <SEO title={pageTitle({})} />
      <Header />

      <Main>
        <EntryHeader title="Latest Posts" />
        <div className="container">
          <Posts posts={posts?.nodes} id="posts-list" />
        </div>
      </Main>

      <Footer />
    </>
  );
}

export async function getStaticProps(ctx) {
  return getNextStaticProps(ctx, (client: Client) =>
    client
      .query(POSTS_QUERY, {
        categoryName: 'uncategorized',
        first: appConfig.postsPerPage,
      })
      .toPromise()
  );
}

export default withUrqlClient((_ssrExchange, ctx) => ({
  url: appConfig.graphqlEndpoint,
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange,
    _ssrExchange,
    fetchExchange,
  ],
}))(Page);
