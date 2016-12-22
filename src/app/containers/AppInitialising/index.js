import React from 'react'

import LoadingIndicator from '../../components/LoadingIndicator'

import styles from './styles.css'

const AppInitialising = class extends React.Component {
  componentDidMount () {
    const updateLoadingText = () => {
      let loadingText = this.refs.loadingText
      let currentText = loadingText.innerHTML

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
      <div className={styles.initialising}>
        <p className={`lead ${styles.loading}`}>
          <LoadingIndicator />
          <br /><span ref='loadingText'>Loading</span>
          <br /><small>Please wait</small>
        </p>
      </div>
    )
  }
}

export default AppInitialising
