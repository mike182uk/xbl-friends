import React from 'react'

import { Button } from 'react-bootstrap'

import LoadingIndicator from '../LoadingIndicator'

const customProps = [
  'loadingText',
  'isLoading'
]

const LoadingStateButton = (props) => {
  return (
    <Button {...getButtonProps(props)}>
      {
        props.isLoading
          ? <span><LoadingIndicator /> {props.loadingText}</span>
          : props.children
      }
    </Button>
  )
}

LoadingStateButton.propTypes = {
  loadingText: React.PropTypes.string.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
  children: React.PropTypes.string.isRequired
}

function getButtonProps (props) {
  let buttonProps = Object.assign({}, props)

  customProps.forEach(prop => delete buttonProps[prop])

  buttonProps['disabled'] = props.isLoading

  return buttonProps
}

export default LoadingStateButton
