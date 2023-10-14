import React, {FC} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

interface CustomLoaderProps {
  loading: boolean;
}

const CustomLoader: FC<CustomLoaderProps> = ({loading}) => {
  if (!loading) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    color: '#4CAF50',
  },
});

export default CustomLoader;
