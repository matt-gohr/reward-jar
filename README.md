# Reward Jar 🏆

A fun and interactive reward token tracking app for kids! Help your child learn about earning, saving, and spending tokens to get rewards like TV time, candy, or other treats.

## Features ✨

- **Multiple Token Jars**: Create different jars for different types of rewards (TV tokens, candy tokens, etc.)
- **Visual Progress**: See your progress with colorful progress bars and fun animations
- **Reward Menu**: Set up rewards with different token costs
- **Transaction History**: Track all token earnings and spending
- **Kid-Friendly UI**: Bright colors, fun icons, and easy-to-use interface
- **Serverless Backend**: Built on AWS Lambda for scalability and cost-effectiveness

## Tech Stack 🛠️

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** with TypeScript
- **Express.js** with Serverless Express
- **AWS Lambda** for serverless functions
- **DynamoDB** for data storage
- **Serverless Framework** for deployment

## Getting Started 🚀

### Prerequisites
- Node.js 18+ 
- npm or yarn
- AWS CLI (for deployment)
- AWS account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd reward-jar
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `.env` files in both frontend and backend directories:
   
   **Frontend (.env)**
   ```env
   REACT_APP_API_URL=http://localhost:3001
   ```
   
   **Backend (.env)**
   ```env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   NODE_ENV=development
   ```

### Development

1. **Start the backend server**
   ```bash
   npm run dev:backend
   ```
   The API will be available at `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   npm run dev:frontend
   ```
   The app will be available at `http://localhost:3000`

3. **Or start both simultaneously**
   ```bash
   npm run dev
   ```

### Building for Production

1. **Build both frontend and backend**
   ```bash
   npm run build
   ```

2. **Deploy to AWS**
   ```bash
   npm run deploy
   ```

## API Endpoints 📡

### Tokens
- `GET /api/tokens` - Get all token jars
- `POST /api/tokens` - Create a new token jar
- `PUT /api/tokens/:id` - Update a token jar
- `DELETE /api/tokens/:id` - Delete a token jar
- `POST /api/tokens/:id/add` - Add tokens to a jar
- `POST /api/tokens/:id/spend` - Spend tokens from a jar

### Rewards
- `GET /api/rewards` - Get all rewards
- `POST /api/rewards` - Create a new reward
- `PUT /api/rewards/:id` - Update a reward
- `DELETE /api/rewards/:id` - Delete a reward
- `PATCH /api/rewards/:id/toggle` - Toggle reward active status

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/token/:tokenId` - Get transactions for a specific token

## Usage Guide 📖

### Creating Token Jars
1. Click "Add Jar" on the Token Jars tab
2. Choose a name, color, and icon for your jar
3. Click "Create Jar" to save

### Adding Tokens
1. Click the "Add" button on any token jar
2. Enter the number of tokens to add
3. Optionally add a reason (e.g., "Good behavior")
4. Click "Add Tokens"

### Creating Rewards
1. Go to the Rewards tab
2. Click "Add Reward"
3. Choose a name, description, and token cost
4. Select which token jar to use
5. Click "Create Reward"

### Redeeming Rewards
1. Go to the Rewards tab
2. Find a reward you want to redeem
3. Click "Redeem Reward"
4. Confirm the redemption

## Deployment 🌐

### AWS Setup
1. Install AWS CLI and configure credentials
2. Create an S3 bucket for deployment artifacts
3. Set up DynamoDB table (handled by Serverless Framework)

### Deploy Backend
```bash
cd backend
npm run deploy
```

### Deploy Frontend
1. Build the frontend: `npm run build`
2. Deploy to your preferred hosting service (Netlify, Vercel, S3, etc.)
3. Update the `REACT_APP_API_URL` environment variable to point to your deployed API

## Project Structure 📁

```
reward-jar/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   └── package.json
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Database services
│   │   ├── types/          # TypeScript types
│   │   └── app.ts          # Express app
│   └── serverless.yml      # Serverless configuration
└── package.json            # Root package.json
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ for kids and parents everywhere! 