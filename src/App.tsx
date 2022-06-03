import { useEffect, useState } from 'react'
import './App.css'
import { NOTIFICATION_TYPES } from './types'

type NOTIFICATION = {
  extra: Record<string, any>
  data: any[]
  timestamp: number
  type_id: NOTIFICATION_TYPES
}

const API_URL = 'https://api.overdeso.com/v1'

const NotificationItem = ({ notification }: Record<string, any>) => {
  const { type_id, data } = notification
  const { transactor, entity } = data[0]

  if (type_id === NOTIFICATION_TYPES.TYPE_LIKE) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
        <img
          src={transactor.profile.avatar_url}
          alt={transactor.profile.username}
        />
        <span>{transactor.profile.username} liked your post:</span>
        <a href={'someUrl'}>{entity.post.text.slice(0, 40)}</a>
      </div>
    )
  }
  return null
}

function App() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const getNotifications = async () => {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        body: JSON.stringify([
          {
            method: 'account.notification.list',
            params: { account: 'nader', limit: 50 },
          },
        ]),
      })
      const json = await response.json()
      // small hack to get the data and error from response
      const [error, data] = json[0]
      console.log(data.list)

      if (error) {
        console.error(error)
        return
      }

      setNotifications(data.list)
    }
    getNotifications()
  }, [])

  return (
    <div className="App">
      {notifications.map((notification: NOTIFICATION) => {
        return (
          <NotificationItem
            key={notification.timestamp}
            notification={notification}
          />
        )
      })}
    </div>
  )
}

export default App
