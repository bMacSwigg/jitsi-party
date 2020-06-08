import React, { useState, createContext, useContext, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'

// Using contexts and hook so that other components can use something like addNotification()
// For example for something like follow the leader: on receiving a socket update that 
// someone has requested to follow you, could call addNotification() by importing:
// import useNotifications
// const { add } = useNotifications()

// Global context that keeps track of notifications and exposes functions
// to add or dismiss them. These are the initial values of the context state.
export const NotificationContext = createContext({
    add: () => {},
    dismiss: () => {},
    schedule: () => {},
    notification: null
})

// Toast notification component
function ToastNotification() {
    const { notification, dismiss } = useNotifications()

    return createPortal(
        <div className="toast-notification">
            { notification }
        </div>,
        document.body
    )
}

// Notification provider manages the context state and can be used to wrap components
// using notifications
export function NotificationProvider({ children }) {
    const [ notification, setNotification ] = useState(null)

    const add = text => setNotification(text)
    const dismiss = () => setNotification(null)
    const schedule = event => {
        console.log('scheduling:', event)
    }

    // New context state values with memoized functions so that context only changes if
    // arguments change. This prevents superfluous renders.  
    const context = {
        add: useCallback(text => add(text), []),
        dismiss: useCallback(() => dismiss(), []),
        schedule: useCallback(() => schedule(), []),
        notification
    }

    // would be better to do something like
    // const context = useMemo(() => ({ add, dismiss, schedule }), [notification])

    return (
        <NotificationContext.Provider value={context}>
            <ToastNotification></ToastNotification>
            {children}
        </NotificationContext.Provider>
    )
}

// Custom hook allowing any functional component to use the Notification context API
export function useNotifications() {
    const { add, dismiss, schedule, notification } = useContext(NotificationContext)
    return { add, dismiss, schedule, notification }
}


// TODO maybe put all notifications (event or not) in separate config, link to party event
// or separate config that merges 
// TODO compute time diff
// TODO might have to make this global or something
// function scheduleNotifications(events) {
//     events.forEach(event => {
//         if (event.notification) {
//             setTimeout(() => {
//                 let repeats = 0
//                 const interval = setInterval(() => {
//                     setTimeout(() => {
//                         this.state.notification = event
//                     }, 500)
//                     repeats += 1
//                     if (repeats === event.notification.repeats) {
//                         clearInterval(interval)
//                     }
//                 }, 1000)
//             }, 10000)
//         }
//     })
// }
