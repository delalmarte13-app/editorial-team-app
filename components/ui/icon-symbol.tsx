// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings for Editorial Team app.
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "person.3.fill": "groups",
  "clock.fill": "history",
  // Actions
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "xmark": "close",
  "xmark.circle.fill": "cancel",
  "checkmark": "check",
  "checkmark.circle.fill": "check-circle",
  "plus": "add",
  "minus": "remove",
  "arrow.clockwise": "refresh",
  "square.and.arrow.up": "share",
  "doc.on.doc": "content-copy",
  "trash": "delete",
  // Editorial
  "text.book.closed.fill": "menu-book",
  "pencil": "edit",
  "pencil.and.outline": "draw",
  "magnifyingglass": "search",
  "sparkles": "auto-awesome",
  "wand.and.stars": "auto-fix-high",
  "globe": "language",
  "chart.bar.fill": "bar-chart",
  "tag.fill": "label",
  "paintbrush.fill": "brush",
  "photo.fill": "image",
  "star.fill": "star",
  "lightbulb.fill": "lightbulb",
  "person.fill": "person",
  "info.circle": "info",
  "arrow.up.doc.fill": "upload-file",
  "doc.text.fill": "description",
  "ellipsis": "more-horiz",
  "arrow.left": "arrow-back",
  "arrow.right": "arrow-forward",
  "eye.fill": "visibility",
  "lock.fill": "lock",
  "bolt.fill": "bolt",
  "flame.fill": "local-fire-department",
  "cart.fill": "shopping-cart",
  "megaphone.fill": "campaign",
  "briefcase.fill": "work",
  "translate": "translate",
  "gearshape.fill": "settings",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
