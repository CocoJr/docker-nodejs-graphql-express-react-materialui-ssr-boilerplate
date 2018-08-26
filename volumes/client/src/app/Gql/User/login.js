import gql from 'graphql-tag';
import {UserFragment} from '../Fragment/user';

export default gql`
mutation login($username: String!, $password: String!) {
login(username: $username, password: $password) {
token
...UserFragment
}
}
${UserFragment}
`;
