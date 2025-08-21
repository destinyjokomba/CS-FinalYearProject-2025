declare module "react-simple-maps" {
  import * as React from "react";

  export interface ComposableMapProps extends React.SVGProps<SVGSVGElement> {
    projection?: string | ((width: number, height: number) => unknown);
    projectionConfig?: Record<string, unknown>;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
  }
  export const ComposableMap: React.FC<ComposableMapProps>;

  export interface GeographiesRenderProps {
    geographies: Array<{ rsmKey: string; properties: Record<string, unknown> }>;
  }
  export const Geographies: React.FC<{
    geography: string | object;
    children: (props: GeographiesRenderProps) => React.ReactNode;
  }>;

  type PathBaseProps = Omit<React.SVGProps<SVGPathElement>, "style">;

  export interface GeographyProps extends PathBaseProps {
    geography: unknown;
    style?: {
      default?: React.CSSProperties & { strokeWidth?: number };
      hover?: React.CSSProperties & { strokeWidth?: number };
      pressed?: React.CSSProperties & { strokeWidth?: number };
    };
    children?: React.ReactNode;
  }
  export const Geography: React.FC<GeographyProps>;
}
