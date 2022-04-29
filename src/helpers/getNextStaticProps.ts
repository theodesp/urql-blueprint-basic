import { initUrqlClient } from 'next-urql';
import appConfig from 'app.config';
import { devtoolsExchange } from '@urql/devtools';
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from 'urql';

export default async function getNextStaticProps(ctx, clientPromise) {
  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient(
    {
      url: appConfig.graphqlEndpoint,
      exchanges: [
        devtoolsExchange,
        dedupExchange,
        cacheExchange,
        ssrCache,
        fetchExchange,
      ],
    },
    false
  );

  await clientPromise(client);

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
    revalidate: 600,
  };
}
