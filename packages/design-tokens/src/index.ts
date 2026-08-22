import colors from '../tokens/colors.json' with { type: 'json' };
import typography from '../tokens/typography.json' with { type: 'json' };
import spacing from '../tokens/spacing.json' with { type: 'json' };
import radii from '../tokens/radii.json' with { type: 'json' };
import shadows from '../tokens/shadows.json' with { type: 'json' };
import targets from '../tokens/targets.json' with { type: 'json' };
import breakpoints from '../tokens/breakpoints.json' with { type: 'json' };

export const tokens = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  targets,
  breakpoints,
} as const;

export type DesignTokens = typeof tokens;
export { colors, typography, spacing, radii, shadows, targets, breakpoints };
