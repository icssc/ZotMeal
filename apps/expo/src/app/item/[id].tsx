import { Stack, useGlobalSearchParams } from "expo-router";
import { H3, Image, Text, View } from "tamagui";
import RateItem from "../../../../../packages/ui/src/home_view/RateItem";

// import { api } from "~/utils/api";

const dummyDish = {
  name: "Blueberry Scone",
  id: "123",
  description: "Item Description",
  nutritionInfo: {
    calories: "300",
    dietaryFiber: "2g",
    protein: "10g",
    sugars: "5g",
    totalCarbohydrates: "30g",
    totalFat: "15g",
    transFat: "0g",
    saturatedFat: "5g",
    sodium: "300mg",
    cholesterol: "50mg",
    vitaminA: "10%",
    vitaminC: "10%",
    calcium: "10%",
    iron: "10%",
  },
  dietRestriction: {
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isHalal: true,
  },
};

export default function Post() {
  const { id } = useGlobalSearchParams();
  if (!id || typeof id !== "string") throw new Error("unreachable");
  // const { data } = api.menu.get.useQuery({
  //   date: "1/22/2022",
  //   period: "breakfast",
  //   restaurant: "brandywine",
  // });

  // if (!data) return null;

  // return { data };
  return (
    <>
      <Stack.Screen options={{ headerTitle: id, headerTitleStyle: { color: "#FFFFFF" } }} />
      <View height={"100%"} width={"100%"} padding="4">
        <Image
          source={{
            uri: "https://images.rawpixel.com/image_png_1100/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL2ZyZWVpbWFnZXNjb21wYW55X3Bob3RvX29mX2Nob2NvbGF0ZV9jaGlwX2Nvb2tpZV90b3Bfdmlld19pc29sYV8xOGVkY2ZiYS00ZTJjLTQ5MWItYjZiOC02ZGZjNmY1M2Y0OWIucG5n.png"
          }}
          width={"100%"}
          height={200}
        />
        <H3>{dummyDish.name}</H3>
        <Text>{dummyDish.description}</Text>
        <RateItem />
      </View>
    </>
  );
}
