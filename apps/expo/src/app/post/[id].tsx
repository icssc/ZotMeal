import { useGlobalSearchParams } from "expo-router";

import { api } from "~/utils/api";

export default function Post() {
  const { id } = useGlobalSearchParams();
  if (!id || typeof id !== "string") throw new Error("unreachable");
  const { data } = api.menu.get.useQuery({
    date: "1/22/2022",
    period: "breakfast",
    restaurant: "brandywine",
  });

  // if (!data) return null;

  return { data };
  // <SafeAreaView className="bg-background">
  //   <Stack.Screen options={{ title: data.title }} />
  //   <View className="h-full w-full p-4">
  //     <Text className="py-2 text-3xl font-bold text-primary">
  //       {data.title}
  //     </Text>
  //     <Text className="py-4 text-foreground">{data.content}</Text>
  //   </View>
  // </SafeAreaView>
}
