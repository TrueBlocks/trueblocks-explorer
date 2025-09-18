// TODO: BOGUS - THIS SHOULD BE IN THE BACKEND
// Period constants that match the Go string constants
export const Period = {
  Blockly: 'blockly', // Default - no aggregation, raw data
  Hourly: 'hourly',
  Daily: 'daily',
  Weekly: 'weekly',
  Monthly: 'monthly',
  Quarterly: 'quarterly',
  Annual: 'annual',
} as const;

export type PeriodType = (typeof Period)[keyof typeof Period];

// Human-readable labels for the UI
export const PeriodLabels = {
  [Period.Blockly]: 'Raw Data',
  [Period.Hourly]: 'Hourly',
  [Period.Daily]: 'Daily',
  [Period.Weekly]: 'Weekly',
  [Period.Monthly]: 'Monthly',
  [Period.Quarterly]: 'Quarterly',
  [Period.Annual]: 'Annual',
} as const;

// Options for Select components
export const PeriodOptions = Object.entries(PeriodLabels).map(
  ([value, label]) => ({
    value,
    label,
  }),
);
