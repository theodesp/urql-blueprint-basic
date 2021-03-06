import { dedupExchange, cacheExchange, fetchExchange, useQuery } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { withUrqlClient } from 'next-urql';
import type { Client } from 'urql';
import gql from 'graphql-tag';
import { useRouter } from 'next/router.js';
import isString from 'lodash/isString.js';
import getPostParams from 'utils/getPostParams';

import appConfig from 'app.config';
import getNextStaticProps from 'helpers/getNextStaticProps';
import {
  Header,
  EntryHeader,
  ContentWrapper,
  Footer,
  Main,
  SEO,
} from 'components';
import { pageTitle } from 'utils';

const POST_QUERY = gql`
  query GetPost($idType: PostIdType, $id: ID!) {
    post(idType: $idType, id: $id) {
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

export function PostComponent({ post }) {
  return (
    <>
      <SEO
        title={pageTitle('generalSettings', post?.title, '')}
        imageUrl={post?.featuredImage?.node?.sourceUrl}
      />

      <Header />

      <Main>
        <EntryHeader
          title={post?.title}
          date={post?.date}
          author={post?.author?.node?.name}
          image={post?.featuredImage?.node}
        />

        <div className="container">
          <ContentWrapper content={post?.content}></ContentWrapper>
        </div>
      </Main>

      <Footer />
    </>
  );
}

function Page() {
  const { query } = useRouter();
  const params = getPostParams(query);
  const [{ data, fetching }] = useQuery({
    query: POST_QUERY,
    variables: params,
  });

  if (!isString(params.id)) {
    return null;
  }

  const post = !fetching ? data.post : {};

  return <PostComponent post={post} />;
}

export async function getStaticProps(ctx) {
  const query = ctx.params;
  const params = getPostParams(query);

  return getNextStaticProps(ctx, (client: Client) =>
    client.query(POST_QUERY, params).toPromise()
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
