import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Функция для генерации случайного цвета
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360); // Любой оттенок
  const pastel = `hsl(${hue}, 60%, 70%)`; // 60% насыщенность, 70% яркость
  return pastel;
};

const DonutChart = ({ faultStat }: { faultStat: Map<string, number> }) => {
  // Преобразуем `Map<string, number>` в массив объектов
  const data = Array.from(faultStat)
    .map(([name, value]) => ({ name, value }))
    .filter(({ value }) => {
      return value > 0;
    });

  // Генерируем случайные цвета для каждого элемента
  const colors = data.map(() => getRandomColor());

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={80} // Делаем дырку (Donut Chart)
        outerRadius={120}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${entry.name}`} fill={colors[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default DonutChart;
