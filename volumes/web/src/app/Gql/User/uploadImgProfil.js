/*
* @copyright 2018 Thibault Colette
* @author Thibault Colette <thibaultcolette06@hotmail.fr>
*/

import gql from 'graphql-tag';
import {UserBaseFragment} from '../Fragment/user';

export default gql`
mutation uploadImgProfil($file: Upload!) {
uploadImgProfil(file: $file) {
...UserBaseFragment
}
}
${UserBaseFragment}
`;