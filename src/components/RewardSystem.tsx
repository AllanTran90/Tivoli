type Rule = {
  condition: (value: number) => boolean;
  reward: string;
};

type Props = {
  value: number;
  rules: Rule[];
};

export default function RewardSystem({
  value,
  rules,
}: Props) {
  const matchedRule = rules.find((rule) =>
    rule.condition(value)
  );

  return (
    <div>
      <h2>Reward</h2>

      <p>
        {matchedRule
          ? matchedRule.reward
          : "No reward"}
      </p>
    </div>
  );
}