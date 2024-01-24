import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useRestaurantStore } from '../../stores/restaurant';
import { useEffect } from 'react';
import { RESTAURANTS } from '../../lib/constants';


export default function Page() {
  const { id } = useLocalSearchParams();

  const setRestaurant = useRestaurantStore(store => store.setRestaurant)

  useEffect(() => {
    const currentRestaurant: any = id
    if (RESTAURANTS.includes(currentRestaurant)) {
      setRestaurant(currentRestaurant)
    }
  }, [id])

  return (
    <View className="h-full w-full max-w-2xl mx-auto p-4">
      <View className="h-full w-full p-4 border-4 rounded-xl">
        <Link href="/" className='text-white text-2xl font-bold'>Home</Link>
        <Text className="text-2xl md:text-4xl text-center font-semibold text-red-400">Schedule for {id}</Text>
      </View>
    </View>
  );
}

