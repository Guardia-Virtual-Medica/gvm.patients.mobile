import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          headerTintColor: Colors[colorScheme ?? "light"].text,
        }}
      >
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: "Inicio",
            title: "Inicio",
            drawerIcon: ({ color }) => (
              <IconSymbol size={24} name="house.fill" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "Perfil",
            title: "Perfil",
            drawerIcon: ({ color }) => (
              <IconSymbol size={24} name="person.fill" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="studies"
          options={{
            drawerLabel: "Mis Estudios",
            title: "Mis Estudios",
            drawerIcon: ({ color }) => (
              <IconSymbol
                size={24}
                name="doc.text.magnifyingglass"
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="appointments"
          options={{
            drawerLabel: "Mis Turnos",
            title: "Mis Turnos",
            drawerIcon: ({ color }) => (
              <IconSymbol size={24} name="calendar" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="medical-records"
          options={{
            drawerLabel: "Historial Médico",
            title: "Historial Médico",
            drawerIcon: ({ color }) => (
              <IconSymbol
                size={24}
                name="heart.text.square.fill"
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="orders-and-receipts"
          options={{
            drawerLabel: "Recetas y Órdenes",
            title: "Recetas y Órdenes",
            drawerIcon: ({ color }) => (
              <IconSymbol size={24} name="doc.text.below.ecg" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            drawerLabel: "Consultas Anteriores",
            title: "Consultas Anteriores",
            drawerIcon: ({ color }) => (
              <IconSymbol size={24} name="clock.fill" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="help"
          options={{
            drawerLabel: "Ayuda",
            title: "Ayuda",
            drawerIcon: ({ color }) => (
              <IconSymbol
                size={24}
                name="questionmark.circle.fill"
                color={color}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
