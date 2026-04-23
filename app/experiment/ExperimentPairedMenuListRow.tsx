"use client";

import type { ReactNode } from "react";
import { ExperimentMenuCard } from "./ExperimentMenuCard";

type Props = {
  onClick: () => void;
  icon: ReactNode;
  title: ReactNode;
  subtitle: string;
  marginBottom: number;
};

/**
 * Pareja visual: Add Friends + How To en /experiment.
 * Cualquier ajuste de fila (icono sin frame, intensidad apagada, etc.) vive aquí; solo cambian icono y textos.
 */
export function ExperimentPairedMenuListRow({ onClick, icon, title, subtitle, marginBottom }: Props) {
  return (
    <ExperimentMenuCard
      onClick={onClick}
      icon={icon}
      iconNoFrame
      pairedDimmed
      title={title}
      subtitle={subtitle}
      marginBottom={marginBottom}
    />
  );
}
