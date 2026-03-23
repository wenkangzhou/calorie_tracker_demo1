import { foodsData } from '@/lib/foods-data';
import FoodDetailClient from './client';

export function generateStaticParams() {
  return foodsData.map((food) => ({
    id: food.id,
  }));
}

export default function FoodDetailPage({ params }: { params: { id: string } }) {
  return <FoodDetailClient id={params.id} />;
}
