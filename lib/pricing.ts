import type {
  PricingRule,
  PricingRulesMap,
  PriceCalculation,
  PriceCalculatorInput,
} from '@/types';

export function groupPricingRules(rules: PricingRule[]): PricingRulesMap {
  const grouped: PricingRulesMap = {
    base: [],
    medium: [],
    size: [],
    framing: [],
    extra_person: [],
    add_on: [],
  };
  for (const rule of rules) {
    if (rule.active && grouped[rule.type]) {
      grouped[rule.type].push(rule);
    }
  }
  return grouped;
}

function findRuleValue(
  rules: PricingRule[],
  key: string
): number {
  const rule = rules.find((r) => r.key === key);
  return rule ? Number(rule.numeric_value) : 0;
}

export function calculatePrice(
  input: PriceCalculatorInput,
  rules: PricingRulesMap
): PriceCalculation {
  const peopleCount = Math.max(1, input.peopleCount);

  const baseValue = peopleCount === 1
    ? findRuleValue(rules.base, 'single')
    : peopleCount === 2
    ? findRuleValue(rules.base, 'couple')
    : peopleCount >= 3 && peopleCount <= 4
    ? findRuleValue(rules.base, 'family')
    : findRuleValue(rules.base, 'large_custom');

  const mediumAdjustment = findRuleValue(rules.medium, input.medium);
  const sizeAdjustment = findRuleValue(rules.size, input.size);
  const framingCost = findRuleValue(rules.framing, input.framing);
  const perPersonCharge = findRuleValue(rules.extra_person, 'per_person');
  const extraPeople = peopleCount > 1 ? perPersonCharge * (peopleCount - 1) : 0;

  let addOnsTotal = 0;
  for (const addOnKey of input.addOns) {
    addOnsTotal += findRuleValue(rules.add_on, addOnKey);
  }

  const expressFee =
    input.deadlineType === 'urgent'
      ? findRuleValue(rules.add_on, 'express_delivery')
      : 0;

  const total =
    baseValue +
    mediumAdjustment +
    sizeAdjustment +
    extraPeople +
    framingCost +
    addOnsTotal +
    expressFee;

  return {
    base: baseValue,
    mediumAdjustment,
    sizeAdjustment,
    extraPeople,
    framing: framingCost,
    addOns: addOnsTotal,
    expressFee,
    total: Math.max(0, total),
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const CATEGORY_LABELS: Record<string, string> = {
  pencil: 'Pencil',
  charcoal: 'Charcoal',
  hyper_realistic: 'Hyper-Realistic',
  couple: 'Couple',
  family: 'Family',
  celebrity: 'Celebrity',
  pet: 'Pet',
  custom: 'Custom',
};

export const MEDIUM_LABELS: Record<string, string> = {
  pencil: 'Pencil',
  charcoal: 'Charcoal',
  colour: 'Colour',
};

export const SIZE_LABELS: Record<string, string> = {
  a5: 'A5 (14.8 × 21 cm)',
  a4: 'A4 (21 × 29.7 cm)',
  a3: 'A3 (29.7 × 42 cm)',
  a2: 'A2 (42 × 59.4 cm)',
  custom: 'Custom Size',
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: 'New Order',
  payment_pending: 'Payment Pending',
  confirmed: 'Confirmed',
  drawing_in_progress: 'Drawing in Progress',
  completed: 'Completed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  partial: 'Partial',
  paid: 'Paid',
  refunded: 'Refunded',
};

export const ORDER_STATUS_STEPS = [
  { key: 'new', label: 'New Order' },
  { key: 'payment_pending', label: 'Payment Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'drawing_in_progress', label: 'Drawing in Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];
