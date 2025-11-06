function Testimonials() {
  const reviews = [
    {
      name: 'Priya S.',
      text: 'The temple almirah is stunning! Perfectly crafted and adds a divine touch to our home.',
    },
    {
      name: 'Amit R.',
      text: 'Amazing quality and fast delivery. Durga Handicrafts exceeded my expectations.',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {reviews.map((review, index) => (
        <div
          key={index}
          className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-wood-accent"
        >
          <p className="text-sm sm:text-base text-gray-400 mb-4">{review.text}</p>
          <p className="text-sm font-semibold text-wood-accent">{review.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Testimonials;