import React from 'react';
import { Posts, Header, EntryHeader, Footer, Main, SEO } from 'components';
import { withUrqlClient } from 'next-urql';
import type { Client } from 'urql';
import { dedupExchange, fetchExchange, useQuery, useClient } from 'urql';
import { relayPagination } from '@urql/exchange-graphcache/extras';
import { cacheExchange } from '@urql/exchange-graphcache';
import { devtoolsExchange } from '@urql/devtools';
import { pageTitle } from 'utils';
import appConfig from 'app.config';
import getNextStaticProps from 'helpers/getNextStaticProps';
import { POSTS_QUERY } from 'pages/index';

const ListPosts = ({ variables, onLoadMore }) => {
  const [{ data, fetching, error }] = useQuery({
    query: POSTS_QUERY,
    variables,
  });
  const posts = data?.posts;

  return (
    <div>
      {error && <p>Oh no... {error.message}</p>}
      {fetching && <p>Loading...</p>}
      {posts && (
        <>
          <Posts posts={posts?.nodes} id="posts-list" />
          {posts?.pageInfo?.endCursor && (
            <button onClick={() => onLoadMore(posts.pageInfo.endCursor)}>
              load more
            </button>
          )}
        </>
      )}
    </div>
  );
};

function Page() {
  const [pageVariables, setPageVariables] = React.useState({
    first: appConfig.postsPerPage,
    after: undefined,
    categoryName: 'uncategorized',
  });

  return (
    <>
      <SEO title={pageTitle({})} />
      <Header />

      <Main>
        <EntryHeader title="Latest Posts" />
        <div className="container">
          <ListPosts
            variables={pageVariables}
            onLoadMore={(after) =>
              setPageVariables({
                ...pageVariables,
                ...{
                  after,
                  first: 9,
                  categoryName: 'uncategorized',
                },
              })
            }
          />
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
    cacheExchange({
      resolvers: {
        Query: {
          posts: relayPagination(),
        },
      },
    }),
    _ssrExchange,
    fetchExchange,
  ],
}))(Page);
