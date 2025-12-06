<div align="center">

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 🎫 Tickly RESTful API

**AI-Powered Event Discovery Platform: Intelligent search, real-time payments, and seamless ticket management**

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

🌐 **[Live Demo](https://tickly-api-production.up.railway.app/api)**

</div>

---

## 🎯 About The Project

**Tickly API** is a modern backend for AI-powered event discovery and ticket management. Built with NestJS, TypeORM, and PostgreSQL, it integrates Perplexity AI for intelligent search, Stripe for payments, and Supabase for storage.

### What Makes Tickly Special?

- 🤖 **AI-Powered Search** - Natural language event discovery via Perplexity AI
- 💳 **Stripe Payments** - Complete payment flow with intent confirmation
- 🎟️ **Ticket Management** - Full lifecycle with Supabase storage
- 📖 **Swagger Documentation** - Interactive API docs at `/api`
- 🐳 **Production Ready** - Multi-stage Dockerfile optimized for deployment
- 🔐 **Type-Safe** - Full TypeScript implementation

---

## 🛠️ Tech Stack

**Backend Core:** NestJS · TypeScript · TypeORM  
**Database:** PostgreSQL  
**Services:** Perplexity AI · Stripe · Supabase  
**DevOps:** Docker · Railway

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ · PostgreSQL 14+ · Docker (optional)
- API Keys: Perplexity AI · Stripe · Supabase

### Installation

```bash
# Clone and install
git clone https://github.com/your-username/tickly-api.git
cd tickly-api
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
createdb tickly_db
npm run migration:run

# Start development server
npm run start:dev
```

The API runs at `http://localhost:8080`  
Swagger docs available at `http://localhost:8080/api`

### Environment Variables

See `.env.example` for all required configurations:

```env
# Perplexity AI
PERPLEXITY_API_KEY=pplx-your-key
PERPLEXITY_API_URL=https://api.perplexity.ai

# Stripe
STRIPE_SECRET_KEY=sk_test_your-key

# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=tickly_user
DATABASE_PASSWORD=your_password
DATABASE_NAME=tickly_db

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key
SUPABASE_ANON_KEY=your-key

# App Config
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

> 💡 Get API keys: [Perplexity](https://www.perplexity.ai/settings/api) · [Stripe](https://dashboard.stripe.com/test/apikeys) · [Supabase](https://supabase.com/dashboard)

---

## 🐳 Docker Deployment

### Quick Start with Docker Compose

```bash
docker-compose up -d
```

### Manual Build

```bash
docker build -t tickly-api .
docker run -p 8080:8080 --env-file .env tickly-api
```

**Features:** Multi-stage build · Health checks · Alpine base · ~150MB image

---

## 📖 API Documentation

**Interactive Swagger UI:** `/api`  
**OpenAPI Spec:** `/api-json`

### Core Endpoints

#### Events

```http
POST /events
Find events based on natural language description
Body: { "query": "outdoor concerts in summer", "location": "California" }
```

#### Tickets

```http
GET /tickets/find-all/{userId}
Get all user tickets

GET /tickets/find-by/{userId}
Get specific ticket details
```

#### Stripe Payments

```http
POST /stripe/create-payment-intent
Create payment intent for ticket purchase

POST /stripe/confirm-payment/{paymentIntentId}
Confirm payment with Stripe

POST /stripe/handle-success/{paymentIntentId}
Handle successful payment completion

GET /stripe/payment-intent/{paymentIntentId}
Retrieve payment intent details
```

### Request Examples

#### AI Event Search

```json
POST /events
{
  "query": "outdoor music festivals this summer",
  "location": "Los Angeles",
  "preferences": {
    "priceRange": "affordable",
    "genres": ["rock", "indie"]
  }
}

Response:
{
  "events": [
    {
      "id": "evt_123",
      "name": "Summer Sounds Festival",
      "date": "2024-07-20",
      "location": "LA Memorial Coliseum",
      "aiRelevanceScore": 0.94,
      "description": "..."
    }
  ],
  "suggestions": ["Similar events nearby..."]
}
```

#### Create Payment Intent

```json
POST /stripe/create-payment-intent
{
  "amount": 15000,
  "currency": "usd",
  "eventId": "evt_123",
  "ticketType": "VIP"
}

Response:
{
  "clientSecret": "pi_3abc123_secret_xyz",
  "paymentIntentId": "pi_3abc123"
}
```

#### Confirm Payment

```json
POST /stripe/confirm-payment/pi_3abc123
{
  "paymentMethodId": "pm_card_visa"
}

Response:
{
  "status": "succeeded",
  "ticketId": "tkt_789",
  "qrCode": "data:image/png;base64..."
}
```

---

## 📊 Database Schema

```typescript
// Core Entities
@Entity()
class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() email: string;
  @Column() fullName: string;
  @OneToMany(() => Ticket) tickets: Ticket[];
}

@Entity()
class Event {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column() date: Date;
  @Column() location: string;
  @OneToMany(() => Ticket) tickets: Ticket[];
}

@Entity()
class Ticket {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User) user: User;
  @ManyToOne(() => Event) event: Event;
  @Column() qrCode: string;
  @Column() status: 'active' | 'used' | 'cancelled';
  @Column() stripePaymentIntentId: string;
}
```

---

## 🌐 Frontend Integration

### CORS Configuration

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
```

### Stripe Integration Example

```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

// Create payment intent
const { clientSecret } = await fetch('/stripe/create-payment-intent', {
  method: 'POST',
  body: JSON.stringify({ amount: 15000, currency: 'usd' }),
}).then((r) => r.json());

// Confirm payment
const { error } = await stripe.confirmCardPayment(clientSecret);

if (!error) {
  // Payment successful - handle in backend webhook
  await fetch(`/stripe/handle-success/${paymentIntentId}`, {
    method: 'POST',
  });
}
```

---

## 📁 Project Structure

```
tickly-api/
├── src/
│   ├── events/           # AI-powered event search
│   ├── tickets/          # Ticket management
│   ├── stripe/           # Payment processing
│   ├── users/            # User management
│   ├── supabase/         # Storage integration
│   ├── config/           # App configuration
│   ├── database/         # Entities & migrations
│   └── main.ts           # Entry point
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## 🔒 Security Features

- ✅ Input validation with class-validator
- ✅ SQL injection protection via TypeORM
- ✅ CORS properly configured
- ✅ Environment secrets management
- ✅ Stripe webhook signature verification
- ✅ Supabase Row Level Security

---

## 🚀 Deployment

### Railway

1. Connect GitHub repo to Railway
2. Add environment variables from `.env.example`
3. Railway auto-detects Dockerfile
4. Deploy! 🎉

**Required Variables:** `PERPLEXITY_API_KEY` · `STRIPE_SECRET_KEY` · `DATABASE_*` · `SUPABASE_*` · `FRONTEND_URL`

---

## 🧪 Testing

```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
npm run test:cov    # Coverage
```

---

## 📄 License

© 2025 Tickly. Personal portfolio project - not licensed for public use.

---

## 📞 Contact

**Diego Magaña Álvarez**  
_Full-Stack Developer_

soydiegoo71@gmail.com | +52 445 105 9192

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/diego-magana-dev)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/soydiegomen)

---

## 🙏 Acknowledgments

[NestJS](https://docs.nestjs.com/) · [TypeORM](https://typeorm.io/) · [Perplexity AI](https://www.perplexity.ai/) · [Stripe](https://stripe.com/docs) · [Supabase](https://supabase.com/docs)

---

<div align="center">

⭐ **Star this project if you find it useful!**

**Tickly** - Discover events intelligently with AI 🎫

Made with ❤️ and ☕

</div>
