import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/products/${product.slug}`} className="group block relative h-full cursor-none" data-cursor="discover">
      <div className="flex flex-col h-full overflow-hidden rounded-[2rem] bg-secondary/10 transition-all duration-700 ease-custom hover:bg-background hover:shadow-2xl border border-border/10 hover:border-border/50">
        
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[2rem] bg-secondary/15 flex items-center justify-center p-4">
          {product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-1000 ease-custom group-hover:scale-[1.05]"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground font-light bg-muted/50">
              No Image
            </div>
          )}
          
          {/* Subtle overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          
          <div className="absolute top-6 left-6">
            <span className="bg-background/90 backdrop-blur-md text-foreground text-xs font-semibold px-4 py-2 rounded-full shadow-sm tracking-wider uppercase">
              {product.category}
            </span>
          </div>
        </div>
        
        <div className="p-8 flex flex-col flex-1 justify-between bg-gradient-to-b from-transparent to-background/5">
          <div>
            <h3 className="text-2xl font-bold tracking-tight transition-colors flex items-center justify-between group-hover:text-primary">
              {product.name}
              <ArrowRight className="h-6 w-6 opacity-0 -translate-x-4 transition-all duration-500 ease-custom group-hover:opacity-100 group-hover:translate-x-0" />
            </h3>
            <p className="line-clamp-2 mt-3 text-lg leading-relaxed text-muted-foreground font-light">
              {product.shortDescription}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
