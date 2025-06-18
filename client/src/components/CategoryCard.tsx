import { cn } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  description: string;
  icon: string;
  gradient: string;
  storyCount: number;
  onClick?: () => void;
}

export default function CategoryCard({ 
  name, 
  description, 
  icon, 
  gradient, 
  storyCount, 
  onClick 
}: CategoryCardProps) {
  const getGradientClass = (gradient: string) => {
    switch (gradient) {
      case "from-primary to-sage":
        return "gradient-primary-sage";
      case "from-secondary to-accent":
        return "gradient-secondary-accent";
      case "from-sage to-primary":
        return "gradient-sage-primary";
      case "from-accent to-secondary":
        return "gradient-accent-secondary";
      default:
        return "bg-gradient-to-br from-[#2B5A3E] to-[#87A96B]";
    }
  };

  return (
    <div 
      className={cn(
        "p-6 rounded-2xl text-white hover:scale-105 transition-transform cursor-pointer",
        getGradientClass(gradient)
      )}
      onClick={onClick}
    >
      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
        <i className={`${icon} text-xl`}></i>
      </div>
      <h4 className="font-semibold text-lg mb-2">{name}</h4>
      <p className="text-sm opacity-90 mb-4">{description}</p>
      <div className="text-sm opacity-75">
        {storyCount} {storyCount === 1 ? 'story' : 'stories'}
      </div>
    </div>
  );
}
