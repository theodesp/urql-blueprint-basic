import { dedupExchange, cacheExchange, fetchExchange, useQuery } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { withUrqlClient } from 'next-urql';
import type { Client } from 'urql';
import gql from 'graphql-tag';
import { useRouter } from 'next/router.js';
import isString from 'lodash/isString.js';

import appConfig from 'app.config';
import getNextStaticProps from 'helpers/getNextStaticProps';
import { hasPageId, hasPageUri } from 'helpers/assert';
import {
  Header,
  EntryHeader,
  ContentWrapper,
  Footer,
  Main,
  SEO,
} from 'components';
import { pageTitle } from 'utils';

const PAGE_QUERY = gql`
  query GetPage($idType: PageIdType, $id: ID!) {
    page(idType: $idType, id: $id) {
      content
      date
      id
      title
      uri
      featuredImage {
        node {
          id
          sourceUrl
        }
      }
    }
  }
`;

export function PageComponent({ page }) {
  return (
    <>
      <SEO
        title={pageTitle('', page?.title)}
        imageUrl={page?.featuredImage?.node?.sourceUrl}
      />

      <Header />

      <Main>
        <EntryHeader title={page?.title} image={page?.featuredImage?.node} />
        <div className="container">
          <ContentWrapper content={page?.content} />
        </div>
      </Main>

      <Footer />
    </>
  );
}

function Page() {
  const { query } = useRouter();

  let params = {};
  if (hasPageId(query)) {
    params = {
      id: query.pageId,
      idType: 'ID',
      ...params,
    };
  }
  if (hasPageUri(query)) {
    params = {
      id: query.pageUri.join('/'),
      idType: 'URI',
      ...params,
    };
  }
  const [{ data, fetching }] = useQuery({
    query: PAGE_QUERY,
    variables: params,
  });

  if (!isString(params.id)) {
    return null;
  }

  const page = !fetching ? data.page : {};

  return <PageComponent page={page} />;
}

export async function getStaticProps(ctx) {
  const query = ctx.params;
  let params = {};
  if (hasPageId(query)) {
    params = {
      id: query.pageId,
      idType: 'ID',
      ...params,
    };
  }
  if (hasPageUri(query)) {
    params = {
      id: query.pageUri.join('/'),
      idType: 'URI',
      ...params,
    };
  }

  return getNextStaticProps(ctx, (client: Client) =>
    client.query(PAGE_QUERY, params).toPromise()
  );
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
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
