import { create } from 'zustand';

export type ToastTone = 'success' | 'info' | 'warning';
export type AppToast = { id: string; message: string; tone: ToastTone };
export type AppNotification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
  type: 'weather' | 'health' | 'harvest' | 'task' | 'recommendation' | 'system';
};

const notifications: AppNotification[] = [
  {
    id: 'weather-rain',
    title: 'Heavy rain expected Saturday',
    detail: 'Skip container watering if soil remains moist.',
    time: '2 days ahead',
    read: false,
    type: 'weather',
  },
  {
    id: 'health-check',
    title: 'Tomato leaves need a check',
    detail:
      'Your latest Plant Doctor screening recommends reviewing lower foliage.',
    time: 'Today',
    read: false,
    type: 'health',
  },
  {
    id: 'harvest-window',
    title: 'Basil harvest window is close',
    detail: 'Pinch new tips to encourage a fuller shape.',
    time: 'This week',
    read: true,
    type: 'harvest',
  },
];

type AppState = {
  notifications: AppNotification[];
  toasts: AppToast[];
  language: string;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (
    notification: Omit<AppNotification, 'id' | 'read'> & { id?: string },
  ) => void;
  setLanguage: (language: string) => void;
  showToast: (message: string, tone?: ToastTone) => void;
  dismissToast: (id: string) => void;
};

/** Global, session-level UI feedback and notification state. */
export const useAppStore = create<AppState>((set) => ({
  notifications,
  toasts: [],
  language: 'English',
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: notification.id ?? `notification-${Date.now()}`,
          read: false,
        },
        ...state.notifications,
      ].slice(0, 12),
    })),
  setLanguage: (language) => set({ language }),
  showToast: (message, tone = 'success') => {
    const id = `toast-${Date.now()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, tone }].slice(-4),
    }));
    window.setTimeout(
      () =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
      4200,
    );
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
