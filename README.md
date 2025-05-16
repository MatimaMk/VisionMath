# MathVision Learning Platform

MathVision is an interactive mathematics education platform designed to help students master mathematical concepts through personalized learning paths and adaptive testing. The platform features an integrated Gemini AI assistant that provides tailored support, analyzes performance data, and offers targeted recommendations based on individual learning patterns.

![MathVision Platform](https://via.placeholder.com/800x400?text=MathVision+Learning+Platform)

## Features

- **Interactive Learning Dashboard**: Track your progress with personalized metrics and recommended topics
- **Gemini AI Assistant**: Get real-time help with concepts, personalized recommendations, and performance analysis
- **Comprehensive Testing System**: Take tests across various mathematical topics with immediate feedback
- **Performance Analytics**: View detailed insights about your strengths and areas for improvement
- **Adaptive Learning Paths**: Receive custom recommendations based on your actual test performance

## Detailed Installation Guide

### Prerequisites

- **Node.js**: Version 16.x or higher
  ```bash
  # Check your Node.js version
  node -v
  
  # Install Node.js on Ubuntu/Debian
  curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
  sudo apt-get install -y nodejs
  
  # Install Node.js on macOS with Homebrew
  brew install node
  
  # For Windows, download from https://nodejs.org/
  ```

- **npm/yarn**: npm 8.x+ or yarn 1.22.x+
  ```bash
  # Check npm version
  npm -v
  
  # Update npm
  npm install -g npm@latest
  
  # Install yarn (optional)
  npm install -g yarn
  ```

- **Git**: Latest version recommended
  ```bash
  # Install Git on Ubuntu/Debian
  sudo apt-get install git
  
  # Install Git on macOS
  brew install git
  
  # For Windows, download from https://git-scm.com/download/win
  ```

- **Supabase Account**: Register at [supabase.com](https://supabase.com)

- **Google AI API Access**: For Gemini AI integration

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/mathvision.git
cd mathvision
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

This will install all required dependencies including:
- Next.js framework
- React and React DOM
- TypeScript
- Ant Design components
- Supabase client
- Other utility packages

### Step 3: Set Up Supabase

1. Create a new project in Supabase
2. Go to Project Settings → API to get your project URL and anon/public key
3. eedge functions
4. Create the required database tables (see SQL schema below)
5. Set up Row Level Security policies


### Step 4: Set Up Google Gemini API

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Create an account or sign in
3. Generate an API key for Gemini

### Step 5: Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

For production deployment, add these environment variables to your hosting platform.

### Step 6: Run the Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

Access the application at [http://localhost:3000](http://localhost:3000)

### Step 7: Build for Production

```bash
# Using npm
npm run build
npm start

# Using yarn
yarn build
yarn start
```

## Configuration Options

### Supabase Edge Functions (Optional)

For more complex test generation, you can set up a Supabase Edge Function:

1. Install Supabase CLI
   ```bash
   npm install -g supabase
   ```

2. Initialize and create the function
   ```bash
   supabase init
   supabase functions new testing-api
   ```

3. Implement and deploy your function
   ```bash
   supabase functions deploy testing-api
   ```

## Usage Guide

### Student Dashboard

The dashboard displays:
- Your progress metrics (completed lessons, streak days, math score)
- Personal profile information and learning level
- Subject cards for Algebra, Geometry, Calculus, and Statistics
- Recommended topics based on your performance

### Taking Math Tests

1. Navigate to the Math Test section from the sidebar
2. Configure your test:
   - Select a mathematical topic (e.g., Algebra, Statistics)
   - Choose difficulty level (Easy, Medium, Hard)
   - Set number of questions (5-20 recommended)
3. Complete the test by:
   - Answering multiple-choice questions
   - Providing free-text answers for open-ended questions
4. Review your results:
   - Overall score and time taken
   - Correct/incorrect answers with explanations
   - Personalized recommendations based on performance



## Technology Stack

- **Frontend**: Next.js v13+, React v18+, TypeScript v4.9+
- **UI Components**: Ant Design v5+
- **State Management**: React Context API
- **Backend**: Supabase (PostgreSQL, Authentication, Functions), C#, Abp, .Net 9
- **AI Integration**: Google Gemini API
- **Deployment**: Vercel and rendor for backend


## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

