import { toast } from 'sonner';

const playAlarmSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const context = new AudioContext();
    
    const playBeep = (timeOffset: number) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
    
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
    
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800, context.currentTime + timeOffset);
    
      gainNode.gain.setValueAtTime(0, context.currentTime + timeOffset);
      gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + timeOffset + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + timeOffset + 0.3);
    
      oscillator.start(context.currentTime + timeOffset);
      oscillator.stop(context.currentTime + timeOffset + 0.3);
    };

    // Play a sequence of 4 beeps
    playBeep(0);
    playBeep(0.4);
    playBeep(0.8);
    playBeep(1.2);
    
  } catch (e) {
    console.error('Audio play failed:', e);
  }
};

export const checkAndFireAlarm = (title: string, body: string, alarmId: string) => {
  const alarmEnabled = localStorage.getItem('alarmEnabled') !== 'false';
  if (!alarmEnabled) return;

  const lastFired = localStorage.getItem(`alarm_${alarmId}_fired`);
  const todayDate = new Date().toDateString();

  if (lastFired === todayDate) return;

  try {
    toast(title, {
      description: body,
      duration: 10000,
    });

    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    // Play real sound!
    playAlarmSound();
  } catch (e) {
    console.error('Error in alarm UI:', e);
  }

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/pwa-192x192.svg' });
    localStorage.setItem(`alarm_${alarmId}_fired`, todayDate);
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body, icon: '/pwa-192x192.svg' });
        localStorage.setItem(`alarm_${alarmId}_fired`, todayDate);
      }
    });
  } else {
    localStorage.setItem(`alarm_${alarmId}_fired`, todayDate);
  }
};
