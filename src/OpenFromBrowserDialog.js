import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import withRoot from './withRoot.js';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { Button } from '@mui/material';
import { Dialog } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { DialogActions } from '@mui/material';
import { Table } from '@mui/material';
import { TableHead } from '@mui/material';
import { TableRow } from '@mui/material';
import { TableCell } from '@mui/material';
import { TableBody } from '@mui/material';
import { TableSortLabel } from '@mui/material';
import { Tooltip } from '@mui/material';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import DoYouWantToDeleteDialog from './DoYouWantToDeleteDialog.js';
import SvgPreview from './SvgPreview.js';
import DotSrcPreview from './DotSrcPreview.js';

const numLinesPreview = 5;

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order === 0) {
      return a[1] - b[1];
    } else {
      return order;
    }
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'dotSrc', numeric: false, disablePadding: false, label: 'DOT Source' },
  { id: 'dotSrcLastChangeTime', numeric: false, disablePadding: false, label: 'Last Changed' },
  { id: 'svg', numeric: false, disablePadding: false, label: 'Preview' },
  { id: 'delete', numeric: false, disablePadding: false, label: 'Delete' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    id={row.id}
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    userSelect: 'none',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  table: {
    minWidth: 700,
  },
});

class OpenFromBrowserDialog extends React.Component {

  state = {
    selectedName: this.props.name,
    order: 'desc',
    orderBy: 'dotSrcLastChangeTime',
  }

  handleClose = () => {
    this.props.onClose();
  };

  handleClick = (name) => (event) =>{
    this.setState({selectedName: name});
  };

  handleDoubleClick = (name) => (event) =>{
    this.props.onOpen(name);
  };

  handleOpen = (event) => {
    this.props.onOpen(this.state.selectedName);
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = (property === 'dotSrcLastChangeTime' ? 'desc' : 'asc');

    if (this.state.orderBy === property) {
      if (this.state.order === 'asc') {
        order = 'desc';
      } else {
        order = 'asc';
      }
    }

    this.setState({ order, orderBy });
  };

  handleConfirmedDelete = () => {
    this.setState({
      doYouWantToDeleteDialogIsOpen: false,
    });
    this.props.onDelete(this.state.deleteName);
  };

  handleDelete = (name) => () => {
    this.setState({
      doYouWantToDeleteDialogIsOpen: true,
      deleteName: name,
    });
  };

  handleDoYouWantToDeleteClose = () => {
    this.setState({
      doYouWantToDeleteDialogIsOpen: false,
    });
  }

  render() {
    const { classes } = this.props;
    const { orderBy } = this.state;
    const { order } = this.state;
    const projects = {
      ...this.props.projects,
    };
    if (this.props.name) {
      projects[this.props.name] = {
        dotSrc: this.props.dotSrc,
        dotSrcLastChangeTime: this.props.dotSrcLastChangeTime,
        svg: this.props.svg,
      };
    }
    const projectList = Object.keys(projects).map((name) => {
      const project = projects[name];
      return {
        name: name,
          ...project,
      }
    });
    const selectedName = projects[this.state.selectedName] ? this.state.selectedName : this.props.name;
    return (
      <div>
        <Dialog
          id="open-from-browser-dialog"
          maxWidth={false}
          className={classes.root}
          open
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">Open graph from browser</DialogTitle>
            <IconButton aria-label="Close" onClick={this.handleClose} size="large">
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <DialogContentText>
              Open a graph from the browser&apos;s local storage.
            </DialogContentText>
            <Table className={classes.table}>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
                {stableSort(projectList, getSorting(order, orderBy))
                .map((project) => {
                  const name = project.name;
                  return (
                    <TableRow
                      key={name}
                      selected={name === selectedName}
                      hover
                      onClick={this.handleClick(name)}
                      onDoubleClick={this.handleDoubleClick(name)}
                    >
                    <TableCell component="th" scope="project">
                      {name}
                    </TableCell>
                    <TableCell>
                      <DotSrcPreview
                        dotSrc={project.dotSrc}
                        numLines={numLinesPreview}
                      />
                    </TableCell>
                    <TableCell>
                      {project.dotSrcLastChangeTime ? moment(project.dotSrcLastChangeTime).fromNow() : ''}
                    </TableCell>
                    <TableCell>
                      <SvgPreview
                        svg={project.svg}
                        width="200px"
                        height={Math.ceil(numLinesPreview * 1.2, 1) + "em"}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        id="delete"
                        aria-label="Delete"
                        onClick={this.handleDelete(name)}
                        size="large">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color="secondary" id="cancel">
              Cancel
            </Button>
            <Button onClick={this.handleOpen} color="secondary" id="open">
              Open
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.doYouWantToDeleteDialogIsOpen &&
          <DoYouWantToDeleteDialog
            name={this.state.deleteName}
            onDelete={this.handleConfirmedDelete}
            onClose={this.handleDoYouWantToDeleteClose}
          />
        }
      </div>
    );
  }
}

OpenFromBrowserDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  dotSrc: PropTypes.string.isRequired,
  dotSrcLastChangeTime: PropTypes.number.isRequired,
  projects: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default withRoot(withStyles(OpenFromBrowserDialog, styles));
