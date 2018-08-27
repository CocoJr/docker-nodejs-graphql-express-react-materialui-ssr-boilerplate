/*
* @copyright 2018 Thibault Colette
* @author Thibault Colette <thibaultcolette06@hotmail.fr>
*/

import React from 'react';
import PropTypes from 'prop-types';

export class AdminSubscription extends React.Component {
    componentDidMount() {
        this.props.subscribeToNewUsers();
    }

    render() {
        return null;
    }
}

AdminSubscription.propTypes = {
    subscribeToNewUsers: PropTypes.func,
};