/* =====================================================
   EU LABEL → HUMAN DESCRIPTION MAPPING
===================================================== */

export type FuelGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type WetGrade = 'A' | 'B' | 'C' | 'D' | 'E';

/* ---------- Fuel Efficiency ---------- */
export function getFuelEfficiencyMeta(grade?: string) {
  switch ((grade || '').toUpperCase()) {
    case 'A':
      return {
        text: 'Ultra Fuel Save',
        color: '#2d8934',
        bg: '#eefae5',
      };
    case 'B':
      return {
        text: 'Fuel Efficient',
        color: '#97d700',
        bg: '#eefae5',
      };
    case 'C':
      return {
        text: 'Standard Economy',
        color: '#FFC300',
        bg: '#fff7db',
      };
    case 'D':
      return {
        text: 'Fair Savings',
        color: '#f5b602',
        bg: '#fff0d6',
      };
    default: // E / F / G
      return {
        text: 'Basic Efficiency',
        color: '#e81401',
        bg: '#fdecea',
      };
  }
}

/* ---------- Wet Grip ---------- */
export function getWetGripMeta(grade?: string) {
  switch ((grade || '').toUpperCase()) {
    case 'A':
      return {
        text: 'Max Wet Safety',
        color: '#2d76b9',
        bg: '#ebf4ff',
      };
    case 'B':
      return {
        text: 'High Wet Grip',
        color: '#377ac1',
        bg: '#ebf4ff',
      };
    case 'C':
      return {
        text: 'Balanced Safety',
        color: '#5ba7db',
        bg: '#f1f7fd',
      };
    default: // D / E
      return {
        text: 'Standard Safety',
        color: '#87c2ea',
        bg: '#f1f7fd',
      };
  }
}
