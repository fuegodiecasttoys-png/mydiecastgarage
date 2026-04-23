"use client";

import { experimentIconPrimary } from "./experimentHeroStyle";
import { ExpIconHeartFilled } from "./experimentIcons";
import { ExperimentPremiumPairRowCard, type ExperimentPremiumPairRowCardProps } from "./ExperimentPremiumPairRowCard";

type Props = Omit<ExperimentPremiumPairRowCardProps, "icon">;

/**
 * Wishlist: la misma fila premium que Favorites; solo cambia el icono.
 */
export function ExperimentWishlistGarageCard(props: Props) {
  return (
    <ExperimentPremiumPairRowCard
      {...props}
      icon={<ExpIconHeartFilled color={experimentIconPrimary} size={24} />}
    />
  );
}
