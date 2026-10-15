import { Star, StarHalf } from "lucide-react";

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        if (rating >= star) {
          return (
            <Star
              key={star}
              className="text-yellow-400 fill-yellow-400"
            />
          );
        }

        if (rating >= star - 0.5) {
          return (
            <div key={star} className="relative w-5 h-5">
              <Star
                fill="black"
                className="absolute inset-0 text-gray-300 fill-gray-300"
              />

              <StarHalf
                className="absolute inset-0 text-yellow-400 fill-yellow-400"
              />
            </div>

          );
        }

        return (
          <Star
            key={star}
            className="text-gray-300 fill-gray-300"
          />
        );
      })}
    </div>
  );
};

export default RatingStars;