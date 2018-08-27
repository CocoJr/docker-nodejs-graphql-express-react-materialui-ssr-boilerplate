/*
* @copyright 2018 Thibault Colette
* @author Thibault Colette <thibaultcolette06@hotmail.fr>
*/

import gql from 'graphql-tag';

export let UserBaseFragment = gql`
fragment UserBaseFragment on User {
id
username
email
roles
imgProfil
isActive
createdAt
}
`;

export let UserAdminBaseFragment = gql`
fragment UserAdminBaseFragment on User {
...UserBaseFragment
}
${UserBaseFragment}
`;

export let UserFragment = gql`
fragment UserFragment on User {
...UserBaseFragment
}
${UserBaseFragment}
`;
