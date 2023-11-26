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

enum Status {
  INITIAL,
  WORKING,
  RESTING,
  PAUSED,
}

const App = () => {
  // TODO: replace 25min with user input
  // const totalWorkTime = 25 * 60; // 25min
  const totalWorkTime = 5; // For test: 5s
  // const totalRestTime = 5 * 60; // 5min
  const totalRestTime = 3; // For test: 3s
  // const extendRestTime = 60;
  const extendRestTime = 2; // For test: 2s

  const [seconds, setSeconds] = useState(totalWorkTime); // 25 minutes
  // const [seconds, setSeconds] = useState(5); // 25 minutes
  const [status, setStatus] = useState(Status.INITIAL);
  const [workTimerId, setWorkTimerId] = useState<number | undefined>(undefined);
  const [restTimerId, setRestTimerId] = useState<number | undefined>(undefined);
  const [pausedTimerId, setPausedTimerId] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (seconds === 0) {
      if (status === Status.WORKING) {
        stopWorkTimer();
        Alert.alert(
          'Congratulations!',
          'You have focused for another 25 minuets! Take a 5 minutes breake!',
          [
            {
              text: 'End',
              onPress: () =>
                console.log(
                  'TODO: End session, go to another page, do the analysis',
                ),
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
        stopRestTimer();
        Alert.alert(
          "Time's up!",
          "Take a deep breath! Let's focus for 25 minutes!",
          [
            {
              text: 'End',
              onPress: () =>
                console.log(
                  'TODO: End session, go to another page, do the analysis',
                ),
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
  }, [seconds, status]);

  const startWorkTimer = () => {
    if (status === Status.WORKING && workTimerId) return;
    clearInterval(restTimerId); // Clear the rest timer if running
    setRestTimerId(undefined);

    setStatus(Status.WORKING);
    const id = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(id);
          setWorkTimerId(undefined); // Reset the timer ID
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
      setWorkTimerId(undefined);
    }
  };

  const resetWorkTimer = () => {
    stopWorkTimer();
    setSeconds(totalWorkTime); // Reset to initial work time
    setStatus(Status.INITIAL); // Resume status
  };

  const startRestTimer = () => {
    // If rest timer is already running, do nothing
    if (status === Status.RESTING && restTimerId) return;

    // If work timer is running, stop it first
    if (workTimerId) {
      clearInterval(workTimerId);
      setWorkTimerId(undefined);
    }

    setStatus(Status.RESTING);
    const id = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(id);
          setRestTimerId(undefined); // Reset the timer ID
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
      setRestTimerId(undefined);
    }
  };

  const pauseTimer = () => {
    if (status === Status.WORKING || status === Status.RESTING) {
      const currentTimerId =
        status === Status.WORKING ? workTimerId : restTimerId;
      clearInterval(currentTimerId);
      setPausedTimerId(currentTimerId); // Save the timer ID
      setStatus(Status.PAUSED);
    }
  };

  const resumeTimer = () => {
    if (status !== Status.PAUSED) return;

    const resumeInterval = () =>
      setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000) as unknown as number;

    if (pausedTimerId === workTimerId) {
      setWorkTimerId(resumeInterval());
      setStatus(Status.WORKING);
    } else if (pausedTimerId === restTimerId) {
      setRestTimerId(resumeInterval());
      setStatus(Status.RESTING);
    }
    setPausedTimerId(undefined); // Clear the paused timer ID
  };

  // End the timer, reset working time
  const stopTimer = () => {
    if (status === Status.WORKING) {
      stopWorkTimer();
    } else if (status === Status.RESTING) {
      stopRestTimer();
    }
    resetWorkTimer();
    setStatus(Status.INITIAL);
  };

  const extendRestTimer = () => {
    setSeconds(prevSeconds => prevSeconds + extendRestTime);
    // Only start the timer if it's not already running
    if (!restTimerId) {
      startRestTimer();
    }
  };

  // Extend the rest time for another minute
  const resetRestTimer = () => {
    stopRestTimer();
    setSeconds(totalRestTime);
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
      {status === Status.INITIAL && (
        <Button title="Start" onPress={startWorkTimer} />
      )}
      {(status === Status.WORKING || status === Status.RESTING) && (
        <Button title="Pause" onPress={pauseTimer} />
      )}
      {status === Status.PAUSED && (
        <Button title="Resume" onPress={resumeTimer} />
      )}
      {status !== Status.INITIAL && <Button title="End" onPress={stopTimer} />}
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
