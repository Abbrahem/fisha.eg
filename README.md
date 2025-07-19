# Fox & Hema Store

A modern e-commerce platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Product categories (Others, T-Shirts, Pants)
- Product management with admin dashboard
- Shopping cart functionality
- User authentication
- Responsive design
- Image upload to Cloudinary
- Real-time product updates

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Image Storage**: Cloudinary
- **State Management**: React Context API

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── admin/          # Admin dashboard pages
│   ├── api/            # API routes
│   ├── category/       # Category pages
│   └── product/        # Product detail pages
├── components/          # Reusable components
├── context/            # React context providers
├── lib/                # Firebase configuration
└── services/           # API services
```

## Features

### Admin Dashboard
- Add new products with immediate image upload
- Edit existing products
- Manage product inventory
- View and manage orders

### Product Management
- Support for multiple product categories
- Image upload with preview
- Size and color selection
- Stock management

### Shopping Experience
- Browse products by category
- Search and filter products
- Add items to cart
- Secure checkout process

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
