import { Card, CardContent } from "@/components/ui/card"; // Adjust import based on your UI library

export function RecipeCardSkeleton() {
  return (
    <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full">
      <CardContent className="flex justify-center flex-col items-center gap-0">
        {/* Recipe Text Skeleton (Scrollable Area) */}
       

        {/* Buttons Skeleton (Flex Column) */}
        <div className="flex flex-col gap-2 mt-40 w-full max-w-[125px]">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-full rounded-md bg-gray-200 animate-pulse"
            />
          ))}
        </div>

        {/* Audio Player Skeleton */}
        <div className="mt-4 h-8 w-24 bg-gray-200 rounded-md animate-pulse" />
      </CardContent>
    </Card>
  );
}

export default RecipeCardSkeleton