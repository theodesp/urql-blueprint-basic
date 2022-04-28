import React from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import { withUrqlClient } from 'next-urql';
import { dedupExchange, fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';
import { persistedFetchExchange } from '@urql/exchange-persisted-fetch';
import { useQuery } from 'urql';

import appConfig from 'app.config';
/**
 * A navigation menu component.
 * @param {Props} props The props object.
 * @param {string} props.menuLocation A matching menu location string that can be used to query from WP GraphQL.
 * @param {React.ReactElement} props.children The children to be rendered.
 * @param {string} props.className An optional className to be added to the component.
 * @return {React.ReactElement} The NavigationMenu component.
 */

const MENU_ITEMS_QUERY = gql`
  query GetMenuItems($location: MenuLocationEnum!) {
    menuItems(where: { location: $location }) {
      nodes {
        id
        path
        label
        menu {
          node {
            name
          }
        }
      }
    }
  }
`;

function NavigationMenu({ className, menuLocation, children }) {
  const [{ data, fetching, error }] = useQuery({
    query: MENU_ITEMS_QUERY,
    variables: { location: menuLocation },
  });

  if (!menuLocation) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'The menuLocation prop is required on the <NavigationMenu /> component.'
      );
    }

    return null;
  }

  if (fetching || error) return null;
  const menuItems = data.menuItems;

  if (menuItems.nodes.length === 0) {
    return null;
  }
  console.debug(menuItems);

  return (
    <nav
      className={className}
      role="navigation"
      aria-label={`${menuItems.nodes[0]?.menu.node.name} menu`}
    >
      <ul className="menu">
        {menuItems.nodes?.map((item) => {
          const { id, path, label } = item;
          return (
            <li key={id ?? ''}>
              <Link href={path ?? ''}>{label ?? ''}</Link>
            </li>
          );
        })}
        {children}
      </ul>
    </nav>
  );
}

export default withUrqlClient((ssrExchange) => ({
  url: appConfig.graphqlEndpoint,
}))(NavigationMenu);
