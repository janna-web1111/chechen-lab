import { themes } from "@/data/content";

export function getTheme(themeId: string) {
  return themes.find((theme) => theme.id === themeId);
}

export function getAllCards() {
  return themes.flatMap((theme) => theme.cards);
}
