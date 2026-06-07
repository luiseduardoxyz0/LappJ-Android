import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuração base: decide como a notificação se comporta com o app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Padrão',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Permissão de notificação não concedida!');
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log('As notificações push requerem um dispositivo físico (mas notificações locais funcionam no emulador)');
  }

  return token;
}

export async function scheduleJourneyEndReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Fim da Jornada Diária ⏱️",
      body: "Você já cumpriu 8 horas de jornada hoje. Não esqueça de registrar o fim do turno no aplicativo LappJ.",
      sound: true,
    },
    trigger: { 
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, 
      seconds: 8 * 60 * 60 
    },
  });
}

export async function scheduleLunchReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hora de Voltar! 🍔",
      body: "Faltam apenas 5 minutos para o fim do seu horário de almoço.",
      sound: true,
    },
    trigger: { 
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, 
      seconds: 55 * 60 
    },
  });
}

export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
