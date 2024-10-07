import { router, useLocalSearchParams } from "expo-router";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
    basePokemonStats,
  formatSize,
  formatWeight,
  getPokemonArtwork,
} from "@/functions/pokemon";
import { Card } from "@/components/Card";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStat } from "@/components/pokemon/PokemonStat";
import Animated, { useSharedValue } from "react-native-reanimated";

export default function Pokemon() {
  const colors = useThemeColors();
  const params = useLocalSearchParams() as { id: string };
  const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: params.id });
  const { data: species } = useFetchQuery("/pokemon-species/[id]", {
    id: params.id,
  });

  const mainType = pokemon?.types?.[0].type.name;
  const colorType = mainType ? Colors.type[mainType] : colors.tint;
  const types = pokemon?.types ?? [];
  const bio = species?.flavor_text_entries
    ?.find(({ language }) => language.name === "en")
    ?.flavor_text.replaceAll("\n", ". ");

const stats = pokemon?.stats ?? basePokemonStats
  return (
    <RootView backbgroundColor={colorType}>
      <View>
        <Image
          style={styles.pokeball}
          source={require("@/assets/images/pokeball_big.png")}
        ></Image>
        <Row style={styles.header}>
          <Pressable onPress={router.back}>
            <Row gap={8}>
              <Image
                style={styles.arrow}
                source={require("@/assets/images/arrow_back.png")}
              />

              <ThemedText
                color="grayWhite"
                variant="headline"
                style={{ textTransform: "capitalize" }}
              >
                {pokemon?.name}
              </ThemedText>
            </Row>
          </Pressable>
          <ThemedText variant="subtitle2" color="grayWhite">
            # {params.id.padStart(3, "0")}
          </ThemedText>
        </Row>
        <View style={styles.body}>
          <Image
            style={styles.pokemon}
            source={{
              uri: getPokemonArtwork(params.id),
            }}
          />
          <Card style={styles.card}>
            <Row gap={16} style={{height: 20}}>
              {types.map((type) => (
                <PokemonType name={type.type.name} key={type.type.name} />
              ))}
            </Row>
            <ThemedText variant="subtitle1" style={{ color: colorType }}>
              About
            </ThemedText>
            <Row>
              <PokemonSpec
                style={{
                  borderStyle: "solid",
                  borderRightWidth: 1,
                  borderColor: colors.grayLight,
                }}
                title={formatWeight(pokemon?.weight)}
                description="Weight"
                image={require("@/assets/images/weight.png")}
              />
              <PokemonSpec
                style={{
                  borderStyle: "solid",
                  borderRightWidth: 1,
                  borderColor: colors.grayLight,
                }}
                title={formatSize(pokemon?.height)}
                description="Size"
                image={require("@/assets/images/straighten.png")}
              />
              <PokemonSpec
                title={pokemon?.moves
                  .slice(0, 2)
                  .map((m) => m.move.name)
                  .join("\n")}
                description="Moves"
              />
            </Row>
            <ThemedText>{bio}</ThemedText>
            <ThemedText variant="subtitle1" style={{ color: colorType }}>
              Base Stats
            </ThemedText>
            <View style={{ alignSelf: "stretch" }}>
              {stats.map((stat => 
                <PokemonStat
                  name={stat.stat.name}
                  value={stat.base_stat}
                  color={colorType}
                />
              ))}
            </View>
          </Card>
        </View>
      </View>
    </RootView>
  );
}

const styles = StyleSheet.create({
  header: {
    margin: 20,
    justifyContent: "space-between",
  },
  arrow: {
    height: 32,
    width: 32,
  },
  pokeball: {
    width: 208,
    height: 208,
    opacity: 0.1,
    position: "absolute",
    right: 8,
    top: 8,
  },
  pokemon: {
    width: 200,
    height: 200,
    alignSelf: "center",
    position: "absolute",
    top: -140,
    zIndex: 2,
  },
  body: {
    marginTop: 144,
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    paddingBottom:20,
    gap: 16,
    alignItems: "center",
  },
});
