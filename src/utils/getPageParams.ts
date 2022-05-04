import { hasPageId, hasPageUri } from 'helpers/assert';

export default function getPageParams(query) {
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
  return params;
}
