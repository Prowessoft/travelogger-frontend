import React from 'react';
import { Shield, AlertTriangle, Users, MapPin, Camera, MessageSquare, ThumbsUp, Home, CheckCircle2, XCircle } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-600 to-primary-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">
              Safety & Security Guidelines
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Your safety is our top priority. Follow these guidelines to ensure a secure travel experience.
            </p>
          </div>
        </div>
      </section>

      {/* General Safety Guidelines */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">General Safety Guidelines</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Verification</h3>
                <p className="text-gray-600 mb-4">
                  Complete your profile verification to build trust within the community:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Verify your email and phone number</li>
                  <li>Link your social media accounts</li>
                  <li>Upload a clear profile photo</li>
                  <li>Complete your bio with relevant information</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Communication Safety</h3>
                <p className="text-gray-600 mb-4">
                  Keep all initial communications within our platform:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Use our messaging system for all arrangements</li>
                  <li>Don't share personal contact information too early</li>
                  <li>Report suspicious messages immediately</li>
                  <li>Be wary of users rushing to take communication off-platform</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Meeting Safety</h3>
                <p className="text-gray-600 mb-4">
                  When meeting other users in person:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Always meet in public places first</li>
                  <li>Share your location with trusted friends or family</li>
                  <li>Trust your instincts - if something feels wrong, leave</li>
                  <li>Have a backup plan and emergency contacts ready</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hitchhiking Safety */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <ThumbsUp className="w-8 h-8 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Hitchhiking Safety</h2>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Before Accepting a Ride</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Do's
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Check driver's profile and verification status</li>
                  <li>• Read previous reviews and ratings</li>
                  <li>• Verify vehicle details and license plate</li>
                  <li>• Share trip details with trusted contacts</li>
                  <li>• Agree on contribution and route beforehand</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  Don'ts
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Accept rides from unverified profiles</li>
                  <li>• Share personal contact info before verification</li>
                  <li>• Get in a vehicle that seems unsafe</li>
                  <li>• Accept rides that deviate from planned route</li>
                  <li>• Feel pressured to accept any ride</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">During the Journey</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                Keep your phone charged and within reach
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                Share your live location with trusted contacts
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                Stay awake and alert throughout the journey
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                Trust your instincts - request to stop if uncomfortable
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Couchsurfing Safety */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Home className="w-8 h-8 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Couchsurfing Safety</h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">For Guests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Before Booking</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Thoroughly read host profiles and reviews</li>
                    <li>• Verify the location and neighborhood</li>
                    <li>• Communicate clearly about expectations</li>
                    <li>• Have a backup accommodation plan</li>
                    <li>• Save emergency numbers for the area</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-medium text-gray-900 mb-3">During Your Stay</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Keep important documents secure</li>
                    <li>• Maintain regular contact with family/friends</li>
                    <li>• Respect house rules and boundaries</li>
                    <li>• Keep emergency contacts handy</li>
                    <li>• Trust your instincts about safety</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">For Hosts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Before Accepting Guests</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Verify guest profiles thoroughly</li>
                    <li>• Set clear house rules and boundaries</li>
                    <li>• Communicate expectations clearly</li>
                    <li>• Trust your judgment about requests</li>
                    <li>• Prepare your space appropriately</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-medium text-gray-900 mb-3">During Hosting</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Maintain your personal boundaries</li>
                    <li>• Keep valuables secure</li>
                    <li>• Have a backup plan for emergencies</li>
                    <li>• Know your rights as a host</li>
                    <li>• Report any concerning behavior</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Emergency Resources</h2>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">24/7 Support</h3>
                <p className="text-gray-600">
                  Our support team is available 24/7 for emergency assistance. Use the emergency button in the app or contact us through:
                </p>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li>• Emergency Hotline: +1-800-SAFE-TRAVEL</li>
                  <li>• Emergency Email: emergency@wanderlust.com</li>
                  <li>• In-App Emergency Button (Fastest Response)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Local Emergency Numbers</h3>
                <p className="text-gray-600">
                  Always save local emergency numbers for your destination:
                </p>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li>• Police: Usually 911 (US), 112 (EU)</li>
                  <li>• Ambulance/Medical Services</li>
                  <li>• Local Embassy or Consulate</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-700 mb-2">In Case of Emergency</h3>
                <ol className="list-decimal pl-5 space-y-2 text-red-700">
                  <li>Ensure your immediate safety first</li>
                  <li>Contact local authorities if necessary</li>
                  <li>Use the emergency button in the app</li>
                  <li>Contact your emergency contacts</li>
                  <li>Document any relevant information</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}