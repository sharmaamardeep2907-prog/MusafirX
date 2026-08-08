import Link from 'next/link';
import { Star, Leaf } from 'lucide-react';

export function RestaurantCard({ restaurant }: { restaurant: any }) {
  return (
    <Link href={`/restaurants/${restaurant.slug || restaurant.id}`}>
      <div className="neumorphic-card overflow-hidden group hover:-translate-y-1 transition-all h-full">
        <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'})` }} />
        <div className="p-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-navy group-hover:text-saffron transition-colors">{restaurant.name}</h3>
            <span className="text-xs text-charcoal/50">{restaurant.priceRange || '₹₹'}</span>
          </div>
          <p className="text-xs text-charcoal/50">{restaurant.cuisine || 'Multi-cuisine'}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs"><Star className="w-3 h-3 fill-saffron text-saffron" /> {restaurant.rating}</span>
            {restaurant.isVeg && <span className="flex items-center gap-1 text-xs text-emerald"><Leaf className="w-3 h-3" /> Pure Veg</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
