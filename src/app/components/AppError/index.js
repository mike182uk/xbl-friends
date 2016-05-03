import React from 'react'

import { Alert } from 'react-bootstrap'

export default function AppError (props) {
  return (
    <div>
      <Alert bsStyle='danger'>{props.message}</Alert>
    </div>
  )
}
