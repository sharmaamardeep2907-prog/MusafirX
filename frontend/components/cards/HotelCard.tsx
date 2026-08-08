import Link from 'next/link';
import { Star, MapPin, Wifi, Coffee, Car, Waves } from 'lucide-react';

const amenityIcons: Record<string, any> = { 'WiFi': Wifi, 'Restaurant': Coffee, 'Parking': Car, 'Pool': Waves };

export function HotelCard({ hotel }: { hotel: any }) {
  return (
    <Link href={`/hotels/${hotel.slug || hotel.id}`}>
      <div className="neumorphic-card overflow-hidden group hover:-translate-y-1 transition-all h-full">
        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'})` }}>
          <div className="w-full h-full bg-gradient-to-t from-black/40 to-transparent p-3 flex items-end">
            <div className="flex items-center gap-1 text-white text-xs"><Star className="w-3 h-3 fill-saffron text-saffron" /> {hotel.rating}</div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-navy group-hover:text-saffron transition-colors">{hotel.name}</h3>
          <p className="text-xs text-charcoal/50 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {hotel.address || ''}</p>
          {hotel.pricePerNight && <p className="text-sm font-bold text-emerald mt-2">₹{hotel.pricePerNight}<span className="text-xs text-charcoal/40 font-normal">/night</span></p>}
          {hotel.amenities && <div className="flex gap-1.5 mt-2">{hotel.amenities.slice(0,4).map((a:string)=>{const I=amenityIcons[a]; return I?<I key={a} className="w-4 h-4 text-charcoal/30" title={a}/>:<span key={a} className="text-xs text-charcoal/40">{a}</span>;})}</div>}
        </div>
      </div>
    </Link>
  );
}
