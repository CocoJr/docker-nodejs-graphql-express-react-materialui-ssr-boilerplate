/*
* @author Thibault Colette <thibaultcolette06@hotmail.fr>
* @copyright 2018 Thibault Colette
*/

import Button from '@material-ui/core/es/Button/Button';
import React from 'react';
import CircularProgress from '@material-ui/core/es/CircularProgress/CircularProgress';
import withStyles from '@material-ui/core/es/styles/withStyles';
import green from '@material-ui/core/es/colors/green';
import PropTypes from 'prop-types';

class SubmitBtn extends React.Component {
    render() {
        const {isFetching, isValid, text, classes} = this.props;

        return (
            <Button
                variant="raised"
                color="primary"
                type="submit"
                disabled={isFetching || !isValid}
            >
                {text}
                {isFetching && isValid
                && <CircularProgress size={24} className={classes.buttonProgress}/>
                }
            </Button>
        );
    }
}

SubmitBtn.propTypes = {
    isFetching: PropTypes.bool,
    isValid: PropTypes.bool,
    text: PropTypes.string,
    classes: PropTypes.object,
};

const styles = {
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
};

export default withStyles(styles, { withTheme: true })(SubmitBtn);