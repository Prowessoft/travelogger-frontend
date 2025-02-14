import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const faqCategories = [
  {
    title: "Account & Profile",
    faqs: [
      {
        question: "How do I create an account?",
        answer: "Creating an account is easy! Click the 'Sign Up' button in the top right corner, enter your email and password, choose an avatar, and you're ready to start planning your trips."
      },
      {
        question: "Can I use Wanderlust without creating an account?",
        answer: "Yes, you can browse travel guides and experiences without an account. However, to save itineraries, share experiences, or interact with other travelers, you'll need to create a free account."
      },
      {
        question: "How can I reset my password?",
        answer: "Click the 'Sign In' button, then select 'Forgot Password'. Enter your email address, and we'll send you instructions to reset your password."
      }
    ]
  },
  {
    title: "Trip Planning",
    faqs: [
      {
        question: "How does the AI trip planner work?",
        answer: "Our AI trip planner uses advanced algorithms to create personalized itineraries based on your preferences, budget, and travel dates. It considers factors like local attractions, restaurant recommendations, and optimal route planning to create a comprehensive travel plan."
      },
      {
        question: "Can I modify the AI-generated itinerary?",
        answer: "Absolutely! After the AI generates your initial itinerary, you can fully customize it by adding, removing, or rearranging activities, updating times, and adjusting any details to match your preferences."
      },
      {
        question: "What's the maximum trip duration I can plan?",
        answer: "You can plan trips up to 14 days in duration. For longer trips, we recommend breaking them into multiple segments for better organization and flexibility."
      },
      {
        question: "Can I share my itinerary with travel companions?",
        answer: "Yes! Once you've created an itinerary, you can share it via email or a unique link. Your travel companions can view the itinerary and, if they have accounts, collaborate on the planning."
      }
    ]
  },
  {
    title: "Experiences & Community",
    faqs: [
      {
        question: "How can I share my travel experiences?",
        answer: "Click the 'Share Experience' button on the Experiences page. You can write about your journey, upload photos, and share tips with the community. Make sure to include relevant details like location and dates."
      },
      {
        question: "Are the travel experiences verified?",
        answer: "While we encourage authentic content, travel experiences are shared by community members based on their personal journeys. We recommend using these as inspiration and cross-referencing important details."
      },
      {
        question: "Can I interact with other travelers?",
        answer: "Yes! You can comment on experiences, save posts for inspiration, and connect with fellow travelers. Our community features promote meaningful interactions and travel knowledge sharing."
      }
    ]
  },
  {
    title: "Safety & Privacy",
    faqs: [
      {
        question: "How is my personal information protected?",
        answer: "We use industry-standard encryption to protect your data. Your personal information is never shared with third parties without your consent. Review our Privacy Policy for detailed information."
      },
      {
        question: "Are the recommended accommodations verified?",
        answer: "Our accommodation recommendations come from reputable sources and booking platforms. However, we always encourage users to read recent reviews and do their own research before making bookings."
      },
      {
        question: "What should I do if I notice inappropriate content?",
        answer: "Use the 'Report' button available on all user-generated content to flag inappropriate material. Our moderation team reviews reports promptly to maintain community standards."
      }
    ]
  },
  {
    title: "Technical Support",
    faqs: [
      {
        question: "What browsers are supported?",
        answer: "Wanderlust works best on recent versions of Chrome, Firefox, Safari, and Edge. For optimal experience, we recommend keeping your browser updated to the latest version."
      },
      {
        question: "Can I use Wanderlust on mobile devices?",
        answer: "Yes! Our platform is fully responsive and works on smartphones and tablets. You can plan trips and access your itineraries on any device."
      },
      {
        question: "What should I do if I encounter a technical issue?",
        answer: "First, try refreshing the page or clearing your browser cache. If the issue persists, contact our support team with details about the problem and screenshots if possible."
      }
    ]
  }
];

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Find answers to common questions about our services and travel planning
            </p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={category.title} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => setOpenCategory(openCategory === categoryIndex ? null : categoryIndex)}
                >
                  <h2 className="text-lg font-semibold text-gray-900">{category.title}</h2>
                  {openCategory === categoryIndex ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                {openCategory === categoryIndex && (
                  <div className="divide-y divide-gray-200">
                    {category.faqs.map((faq, index) => (
                      <div key={index} className="bg-white">
                        <button
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                          <span className="text-gray-900 font-medium pr-8">{faq.question}</span>
                          {openIndex === index ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {openIndex === index && (
                          <div className="p-4 bg-gray-50 text-gray-600">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}