import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Grid, Typography, withStyles } from '@material-ui/core';

import { Dropzone } from '../../../../ui';

class Avatar extends Component {
    state = {
        files: [], // An item's format must comply to the File Object's.
    };

    /**
     * Initial files to be fed to dropzone.
     *
     * @return {array}
     */
    loadFiles = (reset = false) => {
        const { user } = this.props;

        if (!user.hasOwnProperty('filename')) {
            return;
        }

        if (user.filename === null) {
            return;
        }

        const files = [
            {
                name: user.original_filename,
                size: user.thumbnail_filesize,
                url: user.thumbnail_url,
                type: `image/${user.filename.split('.').reverse()[0]}`,
                status: 'uploaded',
            },
        ];

        this.setState({
            files,
        });
    };

    /**
     * Handle the removal of files.
     *
     * @param {object} file The file that should be fed to the API.
     * @param {function} removed  When called, will inform that the file is removed.
     *
     * @return {undefined}
     */
    handleFileRemoved = async (file, removed) => {
        const { user } = this.props;

        try {
            await axios.delete(`api/v1/users/${user.id}/avatar`);

            removed();
        } catch (error) {}
    };

    /**
     * Handle the file upload.
     *
     * @param {object} file The file that should be fed to the API.
     * @param {function} done When called, will inform that upload is done.
     *
     * @return {undefined}
     */
    handleUpload = async (file, done) => {
        const { user } = this.props;

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            await fetch(`api/v1/users/${user.id}/avatar`, {
                method: 'POST',
                headers: {
                    Authorization:
                        axios.defaults.headers.common['Authorization'],
                    'X-CSRF-TOKEN':
                        axios.defaults.headers.common['X-CSRF-TOKEN'],
                },
                body: formData,
            });

            done();
        } catch (error) {}
    };

    componentDidMount() {
        this.loadFiles();
    }

    render() {
        const { classes, handleSkip } = this.props;
        const { files } = this.state;

        return (
            <>
                <Typography variant="h6" gutterBottom>
                    Avatar Upload
                </Typography>

                <Dropzone
                    initialFiles={files}
                    maxFiles={2}
                    maxFileSize={2}
                    handleUpload={this.handleUpload}
                    handleFileRemoved={this.handleFileRemoved}
                />

                <div className={classes.sectionSpacer} />

                <Grid container spacing={24} justify="flex-end">
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSkip}
                        >
                            Finish
                        </Button>
                    </Grid>
                </Grid>
            </>
        );
    }
}

Avatar.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    handleSkip: PropTypes.func.isRequired,
};

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 10,
        border: `1px solid ${theme.palette.text.primary}`,
    },

    sectionSpacer: {
        marginTop: theme.spacing.unit * 2,
    },
});

export default withStyles(styles)(Avatar);