import { hasPostId, hasPostSlug, hasPostUri } from 'helpers/assert';
export default function getPostParams(query) {
  let params = {};
  if (hasPostId(query)) {
    params = {
      id: query.postId,
      idType: 'ID',
      ...params,
    };
  } else if (hasPostSlug(query)) {
    params = {
      id: query.postSlug,
      idType: 'SLUG',
      ...params,
    };
  } else if (hasPostUri(query)) {
    params = {
      id: query.postUri.join('/'),
      idType: 'URI',
      ...params,
    };
  }
  return params;
}
