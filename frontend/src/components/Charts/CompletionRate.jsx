import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6'];

export default function CompletionRate({ completed, total }) {
  const data = [
    { name: 'Completed', value: completed },
    { name: 'Remaining', value: total - completed },
  ];
  return (
    <PieChart width={300} height={300}>
      <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
        {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}