import React from 'react'
import { connect } from 'react-redux'

import { Glyphicon } from 'react-bootstrap'

import styles from './style.css'

const AppLoading = class extends React.Component {
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
      <div className={styles.boot} style={{ minHeight: window.innerHeight }}>
        <p className={`lead ${styles.loading}`}>
          <Glyphicon glyph='refresh' bsClass={`glyphicon ${styles.glyphiconRefreshAnimate}`} />
          <br /><span ref='loadingText'>Loading</span>
          <br /><small>Please wait</small>
        </p>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

export default connect(mapStateToProps)(AppLoading)
