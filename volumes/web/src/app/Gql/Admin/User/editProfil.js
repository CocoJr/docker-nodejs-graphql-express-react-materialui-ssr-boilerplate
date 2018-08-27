/*
* @copyright 2018 Thibault Colette
* @author Thibault Colette <thibaultcolette06@hotmail.fr>
*/

import gql from 'graphql-tag';
import {UserBaseFragment} from '../../Fragment/user';

export default gql`
mutation adminUserEditProfil($id: Int!, $isActive: Boolean, $username: String, $email: String, $password: String, $registratedAt: String) {
adminUserEditProfil(id: $id, isActive: $isActive, username: $username, email: $email, password: $password, registratedAt: $registratedAt) {
...UserBaseFragment
}
}
${UserBaseFragment}
`;
