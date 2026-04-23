import React, { useContext, useState } from "react";
import { View } from "react-native";
import { Button, Card, HelperText, Text, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "@/contexts/UserContext";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";

type JwtPayload = {
  user: {};
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const login = async () => {
    try {
      const response = await fetch("http://172.23.62.245:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          mot_de_passe,
        }),
      });
      if (!response.ok) setError("Echec de connexion");
      console.log("login : ", response);
      const { token } = await response.json();
      console.log("token : ", token);
      await AsyncStorage.setItem("token", token);
      const { user } = jwtDecode<JwtPayload>(token);
      setUser(user);
      router.replace("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error("Error during login: ", err);
    }
  };

  return (
    <View>
      <Card.Content>
        <Text>Connection</Text>
        <TextInput label="identifiant" onChangeText={setEmail}></TextInput>
        <TextInput
          label="mot de passe"
          secureTextEntry
          onChangeText={setMotDePasse}
        ></TextInput>
        <HelperText type="error" visible={Boolean(error)}>
          {error}
        </HelperText>
        <Button mode="contained" onPress={login}>
          Se connecter
        </Button>
      </Card.Content>
    </View>
  );
}
