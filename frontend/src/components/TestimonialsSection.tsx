import React from 'react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  image: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, image }) => (
  <div className="bg-gray-800 rounded-lg p-6 shadow-lg relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-green-500/10 to-blue-500/10 z-0"></div>
    <div className="relative z-10">
      <p className="text-gray-300 mb-4">{quote}</p>
      <div className="flex items-center">
        <img src={image} alt={author} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <p className="font-semibold text-white">{author}</p>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  </div>
);

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Xylo has been a game-changer for my indie studio. The global reach and flexible revenue models have helped us thrive.",
      author: "Sarah Johnson",
      role: "Indie Game Developer",
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      quote: "As a gamer, I love the curated selection and exclusive content. Xylo has introduced me to amazing games I wouldn't have found elsewhere.",
      author: "Mike Chen",
      role: "Avid Gamer",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      quote: "The community on Xylo is incredible. I've connected with fellow developers and received valuable feedback on my games.",
      author: "Emily Rodriguez",
      role: "Game Designer",
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">What Our Community Says</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

