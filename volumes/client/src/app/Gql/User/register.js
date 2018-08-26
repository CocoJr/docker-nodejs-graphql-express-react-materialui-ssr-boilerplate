/*
* @copyright 2018 Thibault Colette
* @author Thibault Colette <thibaultcolette06@hotmail.fr>
*/

import gql from 'graphql-tag';
import {UserFragment} from '../Fragment/user';

export default gql`
mutation userRegister($username: String!, $email: String!, $password: String!) {
register(username: $username, email: $email, password: $password) {
...UserFragment
}
}
${UserFragment}
`;
