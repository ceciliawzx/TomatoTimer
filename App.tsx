/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect, useContext} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const App = () => {
  // TODO: replace 25min with user input (?)
  const [seconds, setSeconds] = useState(60 * 25); // 25 minutes
  // const [seconds, setSeconds] = useState(5); // 25 minutes
  const [isWorking, setIsWorking] = useState(true);
  const [workTimerId, setWorkTimerId] = useState<number | null>(null);
  const [restTimerId, setRestTimerId] = useState<number | null>(null);

  useEffect(() => {
    if (seconds === 0) {
      if (isWorking) {
        Alert.alert(
          'Congratulations!',
          'You have focused for another 25 minuets! Take a 5 minutes breake!',
          [
            {
              text: 'End',
              onPress: () => console.log('TODO: End session'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                resetRestTimer();
                startRestTimer();
              },
            },
          ],
        );
      } else {
        Alert.alert(
          "Time's up!",
          "Take a deep breath! Let's focus for 25 minutes!",
          [
            {
              text: 'End',
              onPress: () => console.log('TODO: End session'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                resetWorkTimer();
                startWorkTimer();
              },
            },
            {
              text: 'Extend',
              onPress: () => {
                extendRestTimer();
              },
            },
          ],
        );
      }
    }
  }, [seconds]);

  const startWorkTimer = () => {
    // if (workTimerId) return; // Prevent multiple intervals
    setIsWorking(true);
    const id = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(id);
          return 0; // Reset timer
        }
        return prevSeconds - 1;
      });
    }, 1000) as unknown as number;
    setWorkTimerId(id);
  };

  const stopWorkTimer = () => {
    if (workTimerId) {
      clearInterval(workTimerId);
      setWorkTimerId(null);
    }
  };

  const resetWorkTimer = () => {
    stopWorkTimer();
    setSeconds(25 * 60); // Reset to 25 minutes
    // setSeconds(5); // Reset to 25 minutes
  };

  const startRestTimer = () => {
    // if (restTimerId) return; // Prevent multiple intervals
    setIsWorking(false);
    const id = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(id);
          return 0; // Reset timer
        }
        return prevSeconds - 1;
      });
    }, 1000) as unknown as number;
    setRestTimerId(id);
  };

  const stopRestTimer = () => {
    if (restTimerId) {
      clearInterval(restTimerId);
      setRestTimerId(null);
    }
  };

  // Extend the rest time for another minute
  const extendRestTimer = () => {
    stopRestTimer();
    setSeconds(60); // Reset to 25 minutes
  };

  // Extend the rest time for another minute
  const resetRestTimer = () => {
    stopRestTimer();
    setSeconds(5 * 60); // Reset to 5 minutes
    // setSeconds(5); // Reset to 25 minutes
  };

  // Format time for display
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 48}}>{formatTime(seconds)}</Text>
      <Button title="Start Timer" onPress={startWorkTimer} />
      <Button title="Stop Timer" onPress={stopWorkTimer} />
      <Button title="Reset Timer" onPress={resetWorkTimer} />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 48,
    marginBottom: 30,
  },
});

export default App;
