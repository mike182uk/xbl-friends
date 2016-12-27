import React from 'react'
import { shell } from 'electron'

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
        <div className={styles.gamertagNameContainer}>
          <a href={`https://account.xbox.com/en-US/Profile?GamerTag=${props.gamertag}`} className={styles.gamertag} onClick={openLinkExternally}>{props.gamertag}</a>
          {props.name ? <span className={styles.name}>{props.name}</span> : ''}
        </div>
        <span className={styles.primaryStatus}>{props.primaryStatus}</span>
        {props.secondaryStatus ? <span className={styles.secondaryStatus}>{props.secondaryStatus}</span> : ''}
      </div>
    </div>
  )
}

function openLinkExternally (e) {
  e.preventDefault()

  shell.openExternal(e.target.href)
}
