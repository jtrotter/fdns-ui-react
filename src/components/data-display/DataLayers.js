import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Grid } from '@material-ui/core';
import classNames from 'classnames';
import DragSortableList from '../options/DragSortableList';
import { _headers } from '../../fixtures/shapes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// set the prop types from predefined shapes or standard types
const propTypes = {
  headers: _headers,
  active: PropTypes.bool,
  height: PropTypes.number,
  getHeight: PropTypes.func,
  onSave: PropTypes.func,
};

// set the defaults
const defaultProps = {
  headers: [],
  active: false,
  height: 800,
  onSave() {},
};

// define the class
class DataLayers extends Component {

  // init
  constructor(props) {
    super(props);
    const { active, headers } = this.props;
    this.state = {
      active,
      headers,
      height: this.getHeight(),
    };
  }

  // receive props
  componentWillReceiveProps(nextProps) {
    const { active, headers } = nextProps;

    this.setState({
      active,
      headers,
    });
  }

  // mount add resize listener
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  // unmount remove listener
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  // call update dimensions
  updateDimensions = () => {
    this.setState({
      height: this.getHeight()
    });
  }

  // getter for the table height
  getHeight = () => {
    if (this.props.getHeight) return this.props.getHeight();
    return this.props.height;
  }

  // save click
  handleSaveClick = (event) => {
    this.props.onSave(this.state.headers);
  }

  // visibility click
  handleVisibilityClick = (index) => {
    const nextHeaders = this.state.headers;
    nextHeaders[index].visible = !nextHeaders[index].visible;

    this.setState({
      headers: nextHeaders,
    });
  }

  // sort the item from the new headers
  handleSort = (newHeaders) => {
    const headers = newHeaders.map(header => {
      return header.item;
    });

    this.setState({
      headers,
    });
  }

  renderVisibilityIcon = (visible) => {
    let icon = <FontAwesomeIcon icon="eye" />
    if (!visible) {
      icon = <FontAwesomeIcon icon="eye-slash" />
    }

    return (
      icon
    );
  }

  // render the list
  renderList = () => {
    let list = [];

    this.state.headers.forEach((header, index) => {
      const className = classNames({
        'layers-row': true,
        'fx-grd': true,
        'visible': header.visible
      });

      const iconStyle = {
        color: `#${header.iconColor}`,
      };
      const icon = (
        <FontAwesomeIcon icon={header.icon} style={iconStyle} />
      );

      list.push({
        content: (
          <div className={className} key={index}>
            <span className="drag-icon">
              <FontAwesomeIcon icon="ellipsis-v" />
            </span>
            <div className="col col-3 col-label">
              {icon}
              {header.label}
            </div>
            <div className="col col-3 col-key-name">
              {header.path.replace('$._source.', '')}
            </div>
            <div className="col col-1 col-display">
              <IconButton
                aria-label="Toggle Visibility"
                onClick={this.handleVisibilityClick.bind(null, index)}
                index={index}
                size="small"
              >
                {this.renderVisibilityIcon(header.visible)}
              </IconButton>
            </div>
          </div>
        ),
        item: header,
      });
    });

    return list;
  }

  // main render method
  render() {
    const { height, active } = this.state;

    const style = {
      minHeight: height,
      height,
      maxHeight: height,
    };

    const className = classNames({
      'data-layers': true,
      'active': active,
    });

    const list = this.renderList();

    const placeholder = (
      <div className="placeholder"></div>
    );

    return (
      <div className={className} style={style}>
        <div className="layers-headers fx-grd">
          <div className="col col-3 col-label">Label</div>
          <div className="col col-3 col-key-name">Key Name</div>
          <Button onClick={this.handleSaveClick} className="col col-1 col-display save">Apply</Button>
        </div>
        <div className="layers-rows">
          <DragSortableList items={list} placeholder={placeholder} onSort={this.handleSort} type="vertical" />
        </div>
      </div>
    );
  }
}

// set the props, defaults and export
DataLayers.propTypes = propTypes;
DataLayers.defaultProps = defaultProps;

export default DataLayers;