import React from 'react'

import { Glyphicon } from 'react-bootstrap'

import styles from './styles.css'

export default function LoadingIndicator () {
  return (
    <Glyphicon glyph='refresh' bsClass={`glyphicon ${styles.loadingIndicator}`} />
  )
}
