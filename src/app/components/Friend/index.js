import React from 'react'

import { Image } from 'react-bootstrap'

import styles from './styles.css'

export default function Friend (props) {
  const classNames = [
    styles.friend,
    props.online ? styles.online : styles.offline
  ].join(' ')

  return (
    <div className={classNames}>
      <div className={styles.pic}>
        <Image src={props.gamerpic} circle />
      </div>
      <div className={styles.details}>
        <span className={styles.gamertag}>{props.gamertag}</span>
        {props.name ? <span className={styles.name}>{props.name}</span> : ''}
        <span className={styles.primaryStatus}>{props.primaryStatus}</span>
        {props.secondaryStatus ? <span className={styles.secondaryStatus}>{props.secondaryStatus}</span> : ''}
      </div>
    </div>
  )
}
