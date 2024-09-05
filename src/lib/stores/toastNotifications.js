import { writable } from "svelte/store";

function createRandomId() {
  return Math.random().toString(16).slice(2);
}

function getIconClass(color) {
  switch (color) {
    case "red":
      return "ri-error-warning-fill text-red-500"
    case "yellow":
      return "ri-error-warning-fill text-yellow-500"
    case "green":
      return "ri-thumb-up-fill text-green-500"
    default:
      return "ri-question-mark text-gray-400"
  }
}

function createToastNotificationsStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    addToast: (color, message) => {
      update(notifications => [...notifications, { id: createRandomId(), color, iconClass: getIconClass(color), message }])
    },
    removeToast: (id) => {
      update(notifications => notifications.filter(n => n.id !== id))
    }
  }
}

export const toastNotifications = createToastNotificationsStore();