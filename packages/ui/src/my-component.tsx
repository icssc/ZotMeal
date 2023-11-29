import { greeting } from './greeting'
import { Text, View } from 'react-native'

export function MyComponent() {
  return (
    <View>
      <Text>{greeting}</Text>
    </View>
  );
}
