"use client";

import { experimentIconPrimary } from "./experimentHeroStyle";
import { ExpIconStarFilled } from "./experimentIcons";
import { ExperimentPremiumPairRowCard, type ExperimentPremiumPairRowCardProps } from "./ExperimentPremiumPairRowCard";

type Props = Omit<ExperimentPremiumPairRowCardProps, "icon">;

/**
 * Favorites: delega en ExperimentPremiumPairRowCard (misma fila que Wishlist).
 */
export function ExperimentFavoritesGarageCard(props: Props) {
  return (
    <ExperimentPremiumPairRowCard
      {...props}
      icon={<ExpIconStarFilled color={experimentIconPrimary} size={24} />}
    />
  );
}
