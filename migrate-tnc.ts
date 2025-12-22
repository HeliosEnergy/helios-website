import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.VITE_SANITY_PROJECT_ID || '05vcm5dh'
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN // Required for this script

if (!token) {
    console.error('❌ Error: SANITY_WRITE_TOKEN is missing in .env.local')
    console.log('Please get a write token from https://www.sanity.io/manage and add it to .env.local as SANITY_WRITE_TOKEN=xxx')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: '2024-12-19',
})

// Content structure converted from old TNC page to PortableText - simplified approach
const tncContent = {
  _id: 'terms-and-conditions',
  _type: 'legalPage',
  title: 'Terms and Conditions',
  lastUpdated: new Date().toISOString(),
  content: [
    // Section 1: Acceptance of Terms
    {
      _type: 'block',
      _key: 'section-1',
      style: 'h2',
      children: [{ _type: 'span', text: '1. Acceptance of Terms' }]
    },
    {
      _type: 'block',
      _key: 'section-1-content',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'By accessing or using the services provided by Helios Energy Systems LLC ("Helios", "we", "us", or "our"), you agree to be bound by these Terms and Conditions ("Terms"). These Terms constitute a legally binding agreement between you, an individual user or entity, and Helios regarding your use of our website, services, and any related applications or platforms.\n\nIf you do not agree to these Terms, you must not access or use our services. These Terms apply to all visitors, users, and others who access or use our services. By accessing or using our services, you represent and warrant that you have the right, authority, and capacity to enter into these Terms and to abide by all of the terms and conditions herein.'
        }
      ]
    },

    // Section 2: Description of Services
    {
      _type: 'block',
      _key: 'section-2',
      style: 'h2',
      children: [{ _type: 'span', text: '2. Description of Services' }]
    },
    {
      _type: 'block',
      _key: 'section-2-content',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Helios provides AI-optimized cloud computing infrastructure and related services designed to enable businesses and individuals to leverage high-performance computing resources for artificial intelligence applications. Our services may include, but are not limited to:' }
      ]
    },
    {
      _type: 'block',
      _key: 'section-2-list',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'GPU-accelerated cloud computing instances' }]
    },
    {
      _type: 'block',
      _key: 'section-2-list-2',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'High-performance storage solutions' }]
    },
    {
      _type: 'block',
      _key: 'section-2-list-3',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Network infrastructure and connectivity services' }]
    },
    {
      _type: 'block',
      _key: 'section-2-list-4',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Software development kits and APIs' }]
    },
    {
      _type: 'block',
      _key: 'section-2-list-5',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Technical support and consulting services' }]
    },
    {
      _type: 'block',
      _key: 'section-2-list-6',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Monitoring and management tools' }]
    },
    {
      _type: 'block',
      _key: 'section-2-content-2',
      style: 'normal',
      children: [
        { _type: 'span', text: 'We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without notice. We may also impose limits on certain features or restrict access to parts or all of our services without prior notice or liability.' }
      ]
    },

    // Section 3: Account Registration and Security
    {
      _type: 'block',
      _key: 'section-3',
      style: 'h2',
      children: [{ _type: 'span', text: '3. Account Registration and Security' }]
    },
    {
      _type: 'block',
      _key: 'section-3-content',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'To access certain features of our services, you may be required to create an account. You agree to provide accurate, current, and complete information during registration and to update such information as necessary to maintain its accuracy. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.\n\nYou agree to:'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'section-3-list-1',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Notify Helios immediately of any unauthorized use of your account or any other breach of security' }]
    },
    {
      _type: 'block',
      _key: 'section-3-list-2',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Ensure that you exit from your account at the end of each session' }]
    },
    {
      _type: 'block',
      _key: 'section-3-list-3',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Not share your account credentials with any third party' }]
    },
    {
      _type: 'block',
      _key: 'section-3-list-4',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Not use another user\'s account at any time without the express permission and authority of that user' }]
    },
    {
      _type: 'block',
      _key: 'section-3-content-3',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Helios will not be liable for any loss or damage arising from your failure to comply with this section.' }
      ]
    },

    // Section 4: User Responsibilities and Conduct
    {
      _type: 'block',
      _key: 'section-4',
      style: 'h2',
      children: [{ _type: 'span', text: '4. User Responsibilities and Conduct' }]
    },
    {
      _type: 'block',
      _key: 'section-4-content',
      style: 'normal',
      children: [
        { _type: 'span', text: 'You are responsible for all activities that occur under your account and for ensuring that all users of your account comply with these Terms. You agree not to:' }
      ]
    },
    {
      _type: 'block',
      _key: 'section-4-list-1',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Use our services for any illegal or unauthorized purpose' }]
    },
    {
      _type: 'block',
      _key: 'section-4-list-2',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Violate any laws in your jurisdiction (including but not limited to copyright laws)' }]
    },
    {
      _type: 'block',
      _key: 'section-4-list-3',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Transmit any material that is harmful, offensive, obscene, or objectionable' }]
    },
    {
      _type: 'block',
      _key: 'section-4-list-4',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Interfere with or disrupt the services or servers or networks connected to the services' }]
    },
    {
      _type: 'block',
      _key: 'section-4-list-5',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Attempt to gain unauthorized access to any portion of the services or any other systems or networks' }]
    },
    {
      _type: 'block',
      _key: 'section-4-list-6',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Use any robot, spider, scraper, or other automated means to access the services for any purpose' }]
    },
    {
      _type: 'block',
      _key: 'section-4-content-2',
      style: 'normal',
      children: [
        { _type: 'span', text: 'We reserve the right to terminate your access to our services without notice if we determine, in our sole discretion, that you have violated any provision of these Terms.' }
      ]
    },

    // Section 5: Intellectual Property Rights
    {
      _type: 'block',
      _key: 'section-5',
      style: 'h2',
      children: [{ _type: 'span', text: '5. Intellectual Property Rights' }]
    },
    {
      _type: 'block',
      _key: 'section-5-content',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'All content, trademarks, service marks, logos, trade names, graphics, designs, and other intellectual property displayed on our services are the property of Helios or its licensors and are protected by United States and international intellectual property laws. Nothing in these Terms grants you a right to use any of Helios\'s trademarks, logos, domain names, or other distinctive brand features.\n\nYou retain all rights to any content you submit, post, or display on or through our services. By submitting, posting, or displaying content on or through our services, you grant Helios a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute such content in any existing or future media.\n\nYou represent and warrant that you own or otherwise control all of the rights to the content that you post, that the content is accurate, that use of the content you supply does not violate these Terms and will not cause injury to any person or entity, and that you will indemnify Helios for all claims resulting from content you supply.'
        }
      ]
    },

    // Section 6: Payment Terms and Billing
    {
      _type: 'block',
      _key: 'section-6',
      style: 'h2',
      children: [{ _type: 'span', text: '6. Payment Terms and Billing' }]
    },
    {
      _type: 'block',
      _key: 'section-6-content',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Certain services may require payment of fees. You agree to pay all fees and charges incurred in connection with your account at the rates in effect when the charges were incurred. All fees and charges are non-refundable except as expressly provided in these Terms or as required by law.\n\nYou authorize us to charge your chosen payment provider for services purchased through our platform. You are responsible for maintaining up-to-date payment information and for all charges incurred under your account.\n\nWe reserve the right to modify our pricing structure at any time. We will provide notice of any material changes to pricing, and your continued use of the services after such notice constitutes acceptance of the modified pricing.'
        }
      ]
    },

    // Section 7: Disclaimer of Warranties
    {
      _type: 'block',
      _key: 'section-7',
      style: 'h2',
      children: [{ _type: 'span', text: '7. Disclaimer of Warranties' }]
    },
    {
      _type: 'block',
      _key: 'section-7-content',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Our services are provided on an "as is" and "as available" basis. Helios expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.\n\nHelios makes no warranty that our services will be uninterrupted, timely, secure, or error-free, or that defects will be corrected. Helios does not warrant or make any representations regarding the use or the results of the use of our services in terms of their correctness, accuracy, reliability, or otherwise.'
        }
      ]
    },

    // Section 8: Limitation of Liability
    {
      _type: 'block',
      _key: 'section-8',
      style: 'h2',
      children: [{ _type: 'span', text: '8. Limitation of Liability' }]
    },
    {
      _type: 'block',
      _key: 'section-8-content',
      style: 'normal',
      children: [
        { _type: 'span', text: 'To the maximum extent permitted by law, in no event shall Helios, its affiliates, officers, directors, employees, agents, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:' }
      ]
    },
    {
      _type: 'block',
      _key: 'section-8-list-1',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Your access to or use of or inability to access or use the services' }]
    },
    {
      _type: 'block',
      _key: 'section-8-list-2',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Any conduct or content of any third party on the services' }]
    },
    {
      _type: 'block',
      _key: 'section-8-list-3',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Any content obtained from the services' }]
    },
    {
      _type: 'block',
      _key: 'section-8-list-4',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', text: 'Unauthorized access, use, or alteration of your transmissions or content' }]
    },
    {
      _type: 'block',
      _key: 'section-8-content-2',
      style: 'normal',
      children: [
        { _type: 'span', text: 'In no event shall Helios\'s total liability to you for all damages exceed the amount paid by you, if any, for accessing the services during the twelve months immediately preceding the event giving rise to the claim.' }
      ]
    },

    // Section 9: Indemnification
    {
      _type: 'block',
      _key: 'section-9',
      style: 'h2',
      children: [{ _type: 'span', text: '9. Indemnification' }]
    },
    {
      _type: 'block',
      _key: 'section-9-content',
      style: 'normal',
      children: [
        { _type: 'span', text: 'You agree to indemnify, defend, and hold harmless Helios, its affiliates, officers, directors, employees, agents, licensors, and suppliers from and against all losses, expenses, damages, and costs, including reasonable attorneys\' fees, resulting from any violation of these Terms or any activity related to your account (including negligent or wrongful conduct).' }
      ]
    },

    // Section 10: Term and Termination
    {
      _type: 'block',
      _key: 'section-10',
      style: 'h2',
      children: [{ _type: 'span', text: '10. Term and Termination' }]
    },
    {
      _type: 'block',
      _key: 'section-10-content',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'These Terms are effective until terminated by either party. You may terminate these Terms at any time by discontinuing use of our services and, if applicable, deleting your account.\n\nHelios may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use our services will immediately cease.'
        }
      ]
    },

    // Section 11: Governing Law and Jurisdiction
    {
      _type: 'block',
      _key: 'section-11',
      style: 'h2',
      children: [{ _type: 'span', text: '11. Governing Law and Jurisdiction' }]
    },
    {
      _type: 'block',
      _key: 'section-11-content',
      style: 'normal',
      children: [
        { _type: 'span', text: 'These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. You agree that any dispute arising from or relating to these Terms or our services shall be subject to the exclusive jurisdiction of the state and federal courts located in Delaware, and you consent to the personal jurisdiction of such courts.' }
      ]
    },

    // Section 12: Changes to Terms
    {
      _type: 'block',
      _key: 'section-12',
      style: 'h2',
      children: [{ _type: 'span', text: '12. Changes to Terms' }]
    },
    {
      _type: 'block',
      _key: 'section-12-content',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Helios reserves the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes your acceptance of the new Terms. We recommend that you review these Terms periodically for any changes.' }
      ]
    },

    // Section 13: Entire Agreement
    {
      _type: 'block',
      _key: 'section-13',
      style: 'h2',
      children: [{ _type: 'span', text: '13. Entire Agreement' }]
    },
    {
      _type: 'block',
      _key: 'section-13-content',
      style: 'normal',
      children: [
        { _type: 'span', text: 'These Terms, together with any other legal notices and agreements published by Helios on the services, shall constitute the entire agreement between you and Helios concerning the services. If any provision of these Terms is deemed invalid by a court of competent jurisdiction, the invalidity of such provision shall not affect the validity of the remaining provisions of these Terms, which shall remain in full force and effect.' }
      ]
    },

    // Section 14: Contact Information
    {
      _type: 'block',
      _key: 'section-14',
      style: 'h2',
      children: [{ _type: 'span', text: '14. Contact Information' }]
    },
    {
      _type: 'block',
      _key: 'section-14-content',
      style: 'normal',
      children: [
        { _type: 'span', text: 'If you have any questions about these Terms, please contact us at:' }
      ]
    },
    {
      _type: 'block',
      _key: 'section-14-contact-1',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'Helios Energy Systems LLC' }
      ]
    },
    {
      _type: 'block',
      _key: 'section-14-contact-2',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'Legal Department' }
      ]
    },
    {
      _type: 'block',
      _key: 'section-14-contact-3',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'Email: legal@heliosenergy.io' }
      ]
    }
  ]
};

async function migrateTNC() {
  console.log('🚀 Starting TNC migration to Sanity...')

  try {
    const transaction = client.transaction()

    console.log('  Creating TNC content...')
    transaction.createOrReplace(tncContent)

    const result = await transaction.commit()
    console.log('✅ TNC Migration successful!', result)
    console.log('\nNext steps:')
    console.log('1. Run "npm run sanity" to visit the studio.')
    console.log('2. Verify the TNC document is correctly created.')
    console.log('3. Test the /tnc page in your app.')
  } catch (err) {
    console.error('❌ Migration failed:', err)
  }
}

migrateTNC()