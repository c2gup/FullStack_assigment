const { z } = require('zod');

const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must not exceed 100 characters'),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

const publicEnquirySchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(7, 'Phone number must be at least 7 characters long')
    .max(20, 'Phone number must not exceed 20 characters')
    .regex(/^[0-9+\s()-]+$/, 'Please enter a valid phone number'),
  courseInterest: z
    .string({ required_error: 'Course interest is required' })
    .trim()
    .min(2, 'Course interest must be at least 2 characters long')
    .max(120, 'Course interest must not exceed 120 characters'),
  city: z
    .string()
    .trim()
    .max(100, 'City must not exceed 100 characters')
    .optional()
    .default(''),
  message: z
    .string()
    .trim()
    .max(1000, 'Message must not exceed 1000 characters')
    .optional()
    .default(''),
});

const updateStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'CONVERTED'], {
    errorMap: () => ({ message: 'Status must be one of: NEW, CONTACTED, CONVERTED' }),
  }),
});

const leadQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10) || 10)) : 10)),
  search: z.string().trim().optional().default(''),
  status: z.enum(['NEW', 'CONTACTED', 'CONVERTED', '']).optional().default(''),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

module.exports = {
  registerSchema,
  loginSchema,
  publicEnquirySchema,
  updateStatusSchema,
  leadQuerySchema,
};
