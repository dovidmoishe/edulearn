import { Redirect } from "expo-router";

// Keep old deep links usable without offering an account connection.
export default function RetiredAccountConnection() {
  return <Redirect href="/(tabs)/profile" />;
}
