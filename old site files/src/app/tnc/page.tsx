'use client';

import React from 'react';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-black pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8" style={{ fontFamily: 'var(--font-funnel-display)' }}>
            Terms and Conditions
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8 text-center">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing or using the services provided by Helios Energy Systems LLC (&quot;Helios&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to be bound by these Terms and Conditions (&quot;Terms&quot;). These Terms constitute a legally binding agreement between you, an individual user or entity, and Helios regarding your use of our website, services, and any related applications or platforms.
                </p>
                <p className="text-gray-700">
                  If you do not agree to these Terms, you must not access or use our services. These Terms apply to all visitors, users, and others who access or use our services. By accessing or using our services, you represent and warrant that you have the right, authority, and capacity to enter into these Terms and to abide by all of the terms and conditions herein.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Description of Services</h2>
                <p className="text-gray-700 mb-4">
                  Helios provides AI-optimized cloud computing infrastructure and related services designed to enable businesses and individuals to leverage high-performance computing resources for artificial intelligence applications. Our services may include, but are not limited to:
                </p>
                <ul className="list-disc pl-8 text-gray-700 mb-4">
                  <li>GPU-accelerated cloud computing instances</li>
                  <li>High-performance storage solutions</li>
                  <li>Network infrastructure and connectivity services</li>
                  <li>Software development kits and APIs</li>
                  <li>Technical support and consulting services</li>
                  <li>Monitoring and management tools</li>
                </ul>
                <p className="text-gray-700">
                  We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without notice. We may also impose limits on certain features or restrict access to parts or all of our services without prior notice or liability.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Account Registration and Security</h2>
                <p className="text-gray-700 mb-4">
                  To access certain features of our services, you may be required to create an account. You agree to provide accurate, current, and complete information during registration and to update such information as necessary to maintain its accuracy. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
                <p className="text-gray-700 mb-4">
                  You agree to:
                </p>
                <ul className="list-disc pl-8 text-gray-700 mb-4">
                  <li>Notify Helios immediately of any unauthorized use of your account or any other breach of security</li>
                  <li>Ensure that you exit from your account at the end of each session</li>
                  <li>Not share your account credentials with any third party</li>
                  <li>Not use another user&apos;s account at any time without the express permission and authority of that user</li>
                </ul>
                <p className="text-gray-700">
                  Helios will not be liable for any loss or damage arising from your failure to comply with this section.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. User Responsibilities and Conduct</h2>
                <p className="text-gray-700 mb-4">
                  You are responsible for all activities that occur under your account and for ensuring that all users of your account comply with these Terms. You agree not to:
                </p>
                <ul className="list-disc pl-8 text-gray-700 mb-4">
                  <li>Use our services for any illegal or unauthorized purpose</li>
                  <li>Violate any laws in your jurisdiction (including but not limited to copyright laws)</li>
                  <li>Transmit any material that is harmful, offensive, obscene, or objectionable</li>
                  <li>Interfere with or disrupt the services or servers or networks connected to the services</li>
                  <li>Attempt to gain unauthorized access to any portion of the services or any other systems or networks</li>
                  <li>Use any robot, spider, scraper, or other automated means to access the services for any purpose</li>
                </ul>
                <p className="text-gray-700">
                  We reserve the right to terminate your access to our services without notice if we determine, in our sole discretion, that you have violated any provision of these Terms.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Intellectual Property Rights</h2>
                <p className="text-gray-700 mb-4">
                  All content, trademarks, service marks, logos, trade names, graphics, designs, and other intellectual property displayed on our services are the property of Helios or its licensors and are protected by United States and international intellectual property laws. Nothing in these Terms grants you a right to use any of Helios&apos;s trademarks, logos, domain names, or other distinctive brand features.
                </p>
                <p className="text-gray-700 mb-4">
                  You retain all rights to any content you submit, post, or display on or through our services. By submitting, posting, or displaying content on or through our services, you grant Helios a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute such content in any existing or future media.
                </p>
                <p className="text-gray-700">
                  You represent and warrant that you own or otherwise control all of the rights to the content that you post, that the content is accurate, that use of the content you supply does not violate these Terms and will not cause injury to any person or entity, and that you will indemnify Helios for all claims resulting from content you supply.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Payment Terms and Billing</h2>
                <p className="text-gray-700 mb-4">
                  Certain services may require payment of fees. You agree to pay all fees and charges incurred in connection with your account at the rates in effect when the charges were incurred. All fees and charges are non-refundable except as expressly provided in these Terms or as required by law.
                </p>
                <p className="text-gray-700 mb-4">
                  You authorize us to charge your chosen payment provider for services purchased through our platform. You are responsible for maintaining up-to-date payment information and for all charges incurred under your account.
                </p>
                <p className="text-gray-700">
                  We reserve the right to modify our pricing structure at any time. We will provide notice of any material changes to pricing, and your continued use of the services after such notice constitutes acceptance of the modified pricing.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Disclaimer of Warranties</h2>
                <p className="text-gray-700 mb-4">
                  Our services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. Helios expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </p>
                <p className="text-gray-700">
                  Helios makes no warranty that our services will be uninterrupted, timely, secure, or error-free, or that defects will be corrected. Helios does not warrant or make any representations regarding the use or the results of the use of our services in terms of their correctness, accuracy, reliability, or otherwise.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  To the maximum extent permitted by law, in no event shall Helios, its affiliates, officers, directors, employees, agents, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc pl-8 text-gray-700 mb-4">
                  <li>Your access to or use of or inability to access or use the services</li>
                  <li>Any conduct or content of any third party on the services</li>
                  <li>Any content obtained from the services</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                </ul>
                <p className="text-gray-700">
                  In no event shall Helios&apos;s total liability to you for all damages exceed the amount paid by you, if any, for accessing the services during the twelve months immediately preceding the event giving rise to the claim.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Indemnification</h2>
                <p className="text-gray-700">
                  You agree to indemnify, defend, and hold harmless Helios, its affiliates, officers, directors, employees, agents, licensors, and suppliers from and against all losses, expenses, damages, and costs, including reasonable attorneys&apos; fees, resulting from any violation of these Terms or any activity related to your account (including negligent or wrongful conduct).
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">10. Term and Termination</h2>
                <p className="text-gray-700 mb-4">
                  These Terms are effective until terminated by either party. You may terminate these Terms at any time by discontinuing use of our services and, if applicable, deleting your account.
                </p>
                <p className="text-gray-700">
                  Helios may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use our services will immediately cease.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">11. Governing Law and Jurisdiction</h2>
                <p className="text-gray-700">
                  These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. You agree that any dispute arising from or relating to these Terms or our services shall be subject to the exclusive jurisdiction of the state and federal courts located in Delaware, and you consent to the personal jurisdiction of such courts.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">12. Changes to Terms</h2>
                <p className="text-gray-700">
                  Helios reserves the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on our website and updating the &quot;Last updated&quot; date. Your continued use of our services after such changes constitutes your acceptance of the new Terms. We recommend that you review these Terms periodically for any changes.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">13. Entire Agreement</h2>
                <p className="text-gray-700">
                  These Terms, together with any other legal notices and agreements published by Helios on the services, shall constitute the entire agreement between you and Helios concerning the services. If any provision of these Terms is deemed invalid by a court of competent jurisdiction, the invalidity of such provision shall not affect the validity of the remaining provisions of these Terms, which shall remain in full force and effect.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">14. Contact Information</h2>
                <p className="text-gray-700">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 font-semibold">Helios Energy Systems LLC</p>
                  <p className="text-gray-700">Legal Department</p>
                  <p className="text-gray-700">Email: legal@heliosenergy.io</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsAndConditions;