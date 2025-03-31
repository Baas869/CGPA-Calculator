import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id='contact' className='bg-white py-16'>
      <div className='container mx-auto px-6'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-primary-color mb-4'>
            Get In <span className='text-link-primary-color'>Touch</span>
          </h2>
          <p className='text-secondary-text max-w-2xl mx-auto'>
            Have questions or want to discuss a project? Reach out to us and our team will get back to you as soon as possible.
          </p>
        </div>

        <div className='flex flex-col lg:flex-row gap-10'>
          {/* Contact Form */}
          <div className='lg:w-1/2 bg-gray-50 p-8 rounded-lg shadow-lg'>
            <h3 className='text-2xl font-bold text-primary-color mb-6'>Send Us a Message</h3>
            <form className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label htmlFor='name' className='block text-secondary-text font-medium mb-2'>Your Name</label>
                  <input
                    type='text'
                    id='name'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-link-primary-color'
                    placeholder='John Doe'
                    required
                  />
                </div>
                <div>
                  <label htmlFor='email' className='block text-secondary-text font-medium mb-2'>Email Address</label>
                  <input
                    type='email'
                    id='email'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-link-primary-color'
                    placeholder='john@example.com'
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor='subject' className='block text-secondary-text font-medium mb-2'>Subject</label>
                <input
                  type='text'
                  id='subject'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-link-primary-color'
                  placeholder='How can we help?'
                  required
                />
              </div>
              <div>
                <label htmlFor='message' className='block text-secondary-text font-medium mb-2'>Your Message</label>
                <textarea
                  id='message'
                  rows='5'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-link-primary-color'
                  placeholder='Tell us about your project...'
                  required
                ></textarea>
              </div>
              <button
                type='submit'
                className='w-full bg-btn-primary-color text-primary-text font-bold py-3 px-6 rounded-lg hover:bg-btn-hover-color transition duration-300 flex items-center justify-center gap-2'
              >
                <FaPaperPlane /> Send Message
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className='lg:w-1/2 bg-primary-color text-primary-text p-8 rounded-lg shadow-lg'>
            <h3 className='text-2xl font-bold mb-6'>Contact Information</h3>
            <p className='mb-8'>Feel free to reach out to us through any of these channels.</p>
            
            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='bg-link-primary-color p-3 rounded-full'>
                  <FaPhone className='text-xl' />
                </div>
                <div>
                  <h4 className='font-bold text-lg'>Phone</h4>
                  <p className='text-gray-300'>+1 (234) 567-8900</p>
                  <p className='text-gray-300'>+1 (234) 567-8901</p>
                </div>
              </div>
              
              <div className='flex items-start gap-4'>
                <div className='bg-link-primary-color p-3 rounded-full'>
                  <FaEnvelope className='text-xl' />
                </div>
                <div>
                  <h4 className='font-bold text-lg'>Email</h4>
                  <p className='text-gray-300'>info@yourcompany.com</p>
                  <p className='text-gray-300'>support@yourcompany.com</p>
                </div>
              </div>
              
              <div className='flex items-start gap-4'>
                <div className='bg-link-primary-color p-3 rounded-full'>
                  <FaMapMarkerAlt className='text-xl' />
                </div>
                <div>
                  <h4 className='font-bold text-lg'>Office</h4>
                  <p className='text-gray-300'>123 Business Avenue</p>
                  <p className='text-gray-300'>New York, NY 10001</p>
                </div>
              </div>
            </div>

            <div className='mt-10'>
              <h4 className='font-bold text-lg mb-4'>Business Hours</h4>
              <ul className='space-y-2 text-gray-300'>
                <li className='flex justify-between'>
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </li>
                <li className='flex justify-between'>
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </li>
                <li className='flex justify-between'>
                  <span>Sunday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;