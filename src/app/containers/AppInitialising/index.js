import React from 'react'

import { Glyphicon } from 'react-bootstrap'

import styles from './styles.css'
import commonStyles from '../../common.css'

const AppInitialising = class extends React.Component {
  componentDidMount () {
    const updateLoadingText = () => {
      var loadingText = this.refs.loadingText
      var currentText = loadingText.innerHTML

      if (currentText.substring(currentText.length - 3) === '...') {
        loadingText.innerHTML = currentText.substring(0, currentText.length - 3)
      } else {
        loadingText.innerHTML += '.'
      }
    }

    this.updateLoadingTextTimer = setInterval(updateLoadingText, 500)
  }

  componentWillUnmount () {
    clearInterval(this.updateLoadingTextTimer)
  }

  render () {
    return (
      <div className={styles.initialising} style={{ minHeight: window.innerHeight }}>
        <p className={`lead ${styles.loading}`}>
          <Glyphicon glyph='refresh' bsClass={`glyphicon ${commonStyles.glyphiconRefreshAnimate}`} />
          <br /><span ref='loadingText'>Loading</span>
          <br /><small>Please wait</small>
        </p>
      </div>
    )
  }
}

export default AppInitialising
