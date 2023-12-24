import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import withRoot from './withRoot.js';
import { Dialog } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { DialogTitle } from '@mui/material';
import graphvizVersions from './graphviz-versions.json';
import packageJSON from '../package.json';
import versions from './versions.json';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const styles = theme => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  copyright: {
    marginTop: theme.spacing(5),
  },
});

class AboutDialog extends React.Component {

  handleClose = () => {
    this.props.onAboutDialogClose();
  };

  render() {
    const { classes } = this.props;
    const version = packageJSON.version;
    const changelogHeaderId = (() => {
      if (versions[version] == null) {
        return version;
      }
      else {
        const releaseDate = versions[version].release_date;
        return version.replace(/\./g, '') + "---" + releaseDate;
      }
    })();
    const graphvizVersion = this.props.graphvizVersion;
    const graphvizReleaseDate = graphvizVersions[graphvizVersion].release_date;
    const graphvizChangelogHeaderId = graphvizVersion.replace(/\./g, '') + "-" + graphvizReleaseDate;
    return (
      <div>
        <Dialog id="about-dialog"
          open
          onClose={this.handleClose}
          scroll={'paper'}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">About the Graphviz Visual Editor</DialogTitle>
            <IconButton
              id="close-button"
              aria-label="Close"
              onClick={this.handleClose}
              size="large">
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <DialogContentText>
              Version
              {' '}
              <a
                href={"https://github.com/magjac/graphviz-visual-editor/blob/master/CHANGELOG.md#" + changelogHeaderId}
                target="_blank"
                rel="noreferrer noopener"
              >
                 {packageJSON.version}
              </a>
            </DialogContentText>
            <br/>
            <DialogContentText>
              The Graphviz Visual Editor is a web application for
              interactive visual editing of
              {' '}
              <a
                href="http://www.graphviz.org"
                target="_blank"
                rel="noreferrer noopener"
              >
                Graphviz
              </a>
              {' '}
              graphs described in the
              {' '}
              <a
                href="https://www.graphviz.org/doc/info/lang.html"
                target="_blank"
                rel="noreferrer noopener"
              >
                DOT
              </a>
              {' '}
              language.
              It is <u>not</u> a general drawing application.
              It can only generate graphs that are possible to describe with DOT.
            </DialogContentText>
            <br/>
            <DialogContentText>
              The Graphviz Visual Editor is an
              {' '}
              <a
                href="https://en.wikipedia.org/wiki/Open-source_software"
                target="_blank"
                rel="noreferrer noopener"
              >
                open source
              </a>
              {' '}
              project and is hosted at
              {' '}
              <a
                href="https://github.com/magjac/graphviz-visual-editor"
                target="_blank"
                rel="noreferrer noopener"
              >
                GitHub
              </a>
              . See the
              {' '}
              <a
                href="https://github.com/magjac/graphviz-visual-editor/blob/master/README.md"
                target="_blank"
                rel="noreferrer noopener"
              >
                README
              </a>
              {' '}
              for more information.
            </DialogContentText>
            <br/>
            <DialogContentText>
              Based on Graphviz version
              {' '}
              <a
                href={"https://gitlab.com/graphviz/graphviz/-/blob/main/CHANGELOG.md#" + graphvizChangelogHeaderId}
                target="_blank"
                rel="noreferrer noopener"
              >
                 {graphvizVersion}
              </a>
            </DialogContentText>
            <DialogContentText variant='caption' className={classes.copyright}>
              &copy; 2018-2022 Magnus Jacobsson Interactive AB
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

AboutDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(AboutDialog, styles));
