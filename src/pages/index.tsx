import React from 'react';
import { withUrqlClient } from 'next-urql';
import { dedupExchange, cacheExchange, fetchExchange, useQuery } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import type { Client } from 'urql';
import gql from 'graphql-tag';
import { FaArrowRight } from 'react-icons/fa';

import getNextStaticProps from 'helpers/getNextStaticProps';
import appConfig from 'app.config';
import {
  Footer,
  Main,
  Button,
  Heading,
  CTA,
  SEO,
  Header,
  Posts,
} from 'components';
import styles from 'styles/pages/_Home.module.scss';
import { pageTitle } from 'utils';

const postsPerPage = 3;

const POSTS_QUERY = gql`
  query GetPosts($first: Int, $categoryName: String) {
    posts(first: $first, where: { categoryName: $categoryName }) {
      nodes {
        id
        uri
        title
        date
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            id
            sourceUrl
          }
        }
      }
    }
  }
`;

function Page() {
  const mainBanner = {
    sourceUrl: '/static/banner.jpeg',
    mediaDetails: { width: 1200, height: 600 },
    altText: 'Blog Banner',
  };
  const [{ data, fetching }] = useQuery({
    query: POSTS_QUERY,
    variables: { categoryName: 'uncategorized', first: postsPerPage },
  });
  const posts = !fetching ? data.posts : {};

  return (
    <>
      <SEO title={pageTitle({})} imageUrl={mainBanner?.sourceUrl} />

      <Header />

      <Main className={styles.home}>
        <div className="container">
          <section className="hero text-center">
            <Heading className={styles.heading} level="h1">
              Welcome to your Blueprint
            </Heading>
            <p className={styles.description}>
              Achieve unprecedented performance with modern frameworks and the
              world&apos;s #1 open source CMS in one powerful headless platform.{' '}
            </p>
            <div className={styles.actions}>
              <Button styleType="secondary" href="/contact-us">
                GET STARTED
              </Button>
              <Button styleType="primary" href="/about">
                LEARN MORE
              </Button>
            </div>
          </section>
          <section className="cta">
            <CTA
              Button={() => (
                <Button href="/posts">
                  Get Started <FaArrowRight style={{ marginLeft: `1rem` }} />
                </Button>
              )}
            >
              <span>
                Learn about Core Web Vitals and how Atlas can help you reach
                your most demanding speed and user experience requirements.
              </span>
            </CTA>
          </section>
          <section className={styles.posts}>
            <Heading className={styles.heading} level="h2">
              Latest Posts
            </Heading>
            <Posts posts={posts?.nodes} id="posts-list" />
          </section>
          <section className="cta">
            <CTA
              Button={() => (
                <Button href="/posts">
                  Get Started <FaArrowRight style={{ marginLeft: `1rem` }} />
                </Button>
              )}
            >
              <span>
                Learn about Core Web Vitals and how Atlas can help you reach
                your most demanding speed and user experience requirements.
              </span>
            </CTA>
          </section>
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
        first: postsPerPage,
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
