export interface DecisionData {
  selected_decision: string;
  action_plan: string;
  other_description: string;
}

export interface DecisionOption {
  value: string;
  label: string;
  disabled?: boolean;
}