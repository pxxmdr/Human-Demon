import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CharacterListScreen from './src/screens/CharacterListScreen';
import CharacterDetailScreen from './src/screens/CharacterDetailScreen';

export type RootStackParamList = {
  CharacterList: undefined;
  CharacterDetail: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="CharacterList"
          component={CharacterListScreen}
          options={{ title: 'Demon Slayer' }}
        />
        <Stack.Screen
          name="CharacterDetail"
          component={CharacterDetailScreen}
          options={{ title: 'Detalhes' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
