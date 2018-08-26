/*
* @copyright 2018 Thibault Colette
* @author Thibault Colette <thibaultcolette06@hotmail.fr>
*/

import React from 'react';
import Grid from '@material-ui/core/es/Grid/Grid';
import Typography from '@material-ui/core/es/Typography/Typography';
import withStyles from '@material-ui/core/es/styles/withStyles';
import styles from '../../Theme/form.css';
import {withApollo} from 'react-apollo/index';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';

class UserDashboardPage extends React.Component {
    render() {
        const {t} = this.props;

        return (
            <Grid container justify={'center'} spacing={16}>
                <Grid item xs={12}>
                    <Typography variant="headline" gutterBottom align="center">
                        {t('title')}
                    </Typography>
                </Grid>
                <Grid item xs={10} md={8}>
                    {t('content')}
                </Grid>
            </Grid>
        );
    }
}

UserDashboardPage.propTypes = {
    t: PropTypes.func
};

export default translate('dashboard')(
    withApollo(
        withStyles(styles, {withTheme: true})(
            UserDashboardPage
        )
    )
);

