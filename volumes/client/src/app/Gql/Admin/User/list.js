import gql from 'graphql-tag';
import {UserAdminBaseFragment} from './../../Fragment/user';

export default gql`
query adminUsers($page: Int!, $limit: Int!, $orderBy: String!, $orderDir: String!) {
adminUsers(page: $page, limit: $limit, orderBy: $orderBy, orderDir: $orderDir) {
page,
limit,
total,
items {
...UserAdminBaseFragment
}
}
}
${UserAdminBaseFragment}
`;
