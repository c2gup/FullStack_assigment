import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  GraduationCap,
  Mail,
  Phone,
  User,
  MapPin,
  MessageSquare,
  BookOpen,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Shield,
  Clock,
  Award,
  Sparkles,
} from 'lucide-react';
import { publicApi, getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';

const courses = [
  'Full Stack Web Development',
  'Data Science & Machine Learning',
  'Cloud Computing & DevOps',
  'UI/UX Design Masterclass',
  'Cybersecurity Analyst',
  'Mobile App Development (React Native & Flutter)',
];

const publicEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 digits')
    .max(20, 'Phone number must not exceed 20 characters')
    .regex(/^[0-9+\s()-]+$/, 'Please enter a valid phone number'),
  courseInterest: z
    .string()
    .min(1, 'Please select a course of interest'),
  city: z.string().trim().max(100).optional().default(''),
  message: z.string().trim().max(1000).optional().default(''),
});

export const PublicEnquiryPage = () => {
  const [submittedLead, setSubmittedLead] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(publicEnquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      courseInterest: '',
      city: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitError('');
    try {
      const response = await publicApi.submitEnquiry(data);
      if (response.success && response.data) {
        setSubmittedLead(response.data);
        toast.success('Enquiry submitted successfully!');
        reset();
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      setSubmitError(msg);
      toast.error(msg);
    }
  };

  const handleResetForm = () => {
    setSubmittedLead(null);
    setSubmitError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 font-bold text-lg">
              ED
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                Global Tech Institute
              </span>
              <span className="text-xs text-slate-500 block leading-tight">
                Empowering next-generation tech leaders
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:text-brand-700 bg-slate-100 hover:bg-brand-50 border border-slate-200 rounded-xl transition-all shadow-sm"
            >
              <span>Counselor Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero & Form Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Institute Info & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admissions Open for 2026 Batch</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Launch your career in tech with industry-accredited programs.
            </h1>

            <p className="text-slate-600 text-base leading-relaxed">
              Connect with our academic counselors to explore specialized bootcamps, flexible weekend schedules, and guaranteed capstone placement assistance.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-4 pt-4 border-t border-slate-200/80">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Industry-Aligned Curriculum</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Co-designed with senior architects at top global tech firms.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Personalized 1-on-1 Mentorship</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Dedicated academic counselors assigned to guide your learning trajectory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">100% Privacy Assured</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Your contact information is strictly used for admissions counseling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Public Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-10">
              {submittedLead ? (
                /* Success Confirmation State */
                <div className="text-center py-8 space-y-5 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Enquiry Received!</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
                      Thank you, <span className="font-semibold text-slate-900">{submittedLead.name}</span>. An academic counselor will review your request for{' '}
                      <span className="font-semibold text-brand-600">{submittedLead.courseInterest}</span> and reach out to you within 24 hours.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs max-w-sm mx-auto space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reference ID:</span>
                      <span className="font-mono font-semibold text-slate-800">{submittedLead._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contact Email:</span>
                      <span className="font-medium text-slate-800">{submittedLead.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-medium text-slate-800">{submittedLead.phone}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors border border-brand-200"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                /* Enquiry Input Form */
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Course Enquiry Form</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out this quick form and an advisor will contact you with batch details and fee structures.
                    </p>
                  </div>

                  {submitError && (
                    <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Full Name *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            id="name"
                            type="text"
                            {...register('name')}
                            placeholder="e.g. John Doe"
                            className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                              errors.name
                                ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
                                : 'border-slate-200 focus:ring-brand-500 focus:bg-white'
                            }`}
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Email Address *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            id="email"
                            type="email"
                            {...register('email')}
                            placeholder="john@example.com"
                            className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                              errors.email
                                ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
                                : 'border-slate-200 focus:ring-brand-500 focus:bg-white'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Phone className="w-4 h-4" />
                          </div>
                          <input
                            id="phone"
                            type="tel"
                            {...register('phone')}
                            placeholder="+1 (555) 000-0000"
                            className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                              errors.phone
                                ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
                                : 'border-slate-200 focus:ring-brand-500 focus:bg-white'
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* City */}
                      <div>
                        <label htmlFor="city" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          City / Location
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <input
                            id="city"
                            type="text"
                            {...register('city')}
                            placeholder="e.g. San Francisco"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Course Selection */}
                    <div>
                      <label htmlFor="courseInterest" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Course Interest *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <select
                          id="courseInterest"
                          {...register('courseInterest')}
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                            errors.courseInterest
                              ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
                              : 'border-slate-200 focus:ring-brand-500 focus:bg-white'
                          }`}
                        >
                          <option value="">Select a course from list...</option>
                          {courses.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.courseInterest && (
                        <p className="mt-1 text-xs text-red-600">{errors.courseInterest.message}</p>
                      )}
                    </div>

                    {/* Optional Message */}
                    <div>
                      <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Background or Questions (Optional)
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          rows={3}
                          {...register('message')}
                          placeholder="Tell us about your learning goals or any questions regarding scholarships or timings..."
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 mt-2 border border-transparent rounded-xl shadow-md shadow-brand-500/20 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-60 transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Request Course Consultation</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          © 2026 Global Tech Institute. All rights reserved. Prospective student data protected under CRM Lead Management protocols.
        </div>
      </footer>
    </div>
  );
};
