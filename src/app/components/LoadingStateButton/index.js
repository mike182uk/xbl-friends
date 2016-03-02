import React from 'react';

import { Button, Glyphicon } from 'react-bootstrap';

import styles from './styles.css';

const customProps = [
  'loadingText',
  'isLoading'
];

const LoadingStateButton = (props) => {
  return (
    <Button {...getButtonProps(props)}>
      {
        props.isLoading ?
          <span><Glyphicon glyph="refresh" bsClass={`glyphicon ${styles.glyphiconRefreshAnimate}`} /> {props.loadingText}</span> :
          props.children
      }
    </Button>
  )
}

LoadingStateButton.propTypes = {
  loadingText: React.PropTypes.string.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
  children: React.PropTypes.string.isRequired
}

function getButtonProps(props) {
  let buttonProps = Object.assign({}, props);

  customProps.forEach(prop => delete buttonProps[prop]);

  buttonProps['disabled'] = props.isLoading;

  return buttonProps;
}

export default LoadingStateButton;
