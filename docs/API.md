# API Documentation

This document describes the REST API endpoints for the Civic DAO backend.

## Base URL

- Development: `http://localhost:3001/api`
- Production: `https://your-backend-domain.com/api`

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Proposals API

### Get All Proposals

```http
GET /proposals
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (active, succeeded, defeated, executed, canceled, expired)
- `category` (string): Filter by category
- `proposer` (string): Filter by proposer address
- `sortBy` (string): Sort field (createdAt, budget, votes)
- `sortOrder` (string): Sort direction (asc, desc)
- `search` (string): Search in title and description

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "New Bike Lane Infrastructure",
      "description": "Proposal description...",
      "proposer": "0x1234...5678",
      "budget": "50000",
      "category": "Infrastructure",
      "status": "active",
      "createdAt": 1703001600000,
      "startBlock": 1000000,
      "endBlock": 1001000,
      "votesFor": 1250,
      "votesAgainst": 320,
      "votesAbstain": 50,
      "totalVotes": 1620,
      "quorum": 1000,
      "executed": false,
      "canceled": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Get Proposal by ID

```http
GET /proposals/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "New Bike Lane Infrastructure",
    "description": "Detailed proposal description...",
    "proposer": "0x1234...5678",
    "budget": "50000",
    "category": "Infrastructure",
    "status": "active",
    "createdAt": 1703001600000,
    "startBlock": 1000000,
    "endBlock": 1001000,
    "votesFor": 1250,
    "votesAgainst": 320,
    "votesAbstain": 50,
    "totalVotes": 1620,
    "quorum": 1000,
    "executed": false,
    "canceled": false,
    "ipfsHash": "QmHash...",
    "txHash": "0xTransactionHash..."
  }
}
```

### Create Proposal

```http
POST /proposals
```

**Request Body:**
```json
{
  "title": "Proposal Title",
  "description": "Detailed description...",
  "category": "Infrastructure",
  "budget": "50000",
  "targets": ["0xContractAddress"],
  "values": ["0"],
  "calldatas": ["0xFunctionCall"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Proposal Title",
    "status": "pending",
    "txHash": "0xTransactionHash..."
  },
  "message": "Proposal created successfully"
}
```

### Vote on Proposal

```http
POST /proposals/:id/vote
```

**Request Body:**
```json
{
  "support": "for",
  "reason": "I support this proposal because..."
}
```

**Support Values:**
- `"for"`: Vote in favor
- `"against"`: Vote against
- `"abstain"`: Abstain from voting

**Response:**
```json
{
  "success": true,
  "data": {
    "voter": "0x1234...5678",
    "support": "for",
    "weight": "100",
    "reason": "I support this proposal because...",
    "txHash": "0xTransactionHash..."
  },
  "message": "Vote submitted successfully"
}
```

### Get Proposal Votes

```http
GET /proposals/:id/votes
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "voter": "0x1234...5678",
      "support": "for",
      "weight": "100",
      "reason": "Great proposal!",
      "blockNumber": 1000050,
      "transactionHash": "0xHash..."
    }
  ]
}
```

### Get Proposal Comments

```http
GET /proposals/:id/comments
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "author": "0x1234...5678",
      "content": "This is a great proposal!",
      "createdAt": "2023-12-20T10:00:00Z",
      "likes": 5,
      "replies": []
    }
  ]
}
```

### Add Comment

```http
POST /proposals/:id/comments
```

**Request Body:**
```json
{
  "content": "This is my comment on the proposal"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "author": "0x1234...5678",
    "content": "This is my comment on the proposal",
    "createdAt": "2023-12-20T10:00:00Z",
    "likes": 0,
    "replies": []
  },
  "message": "Comment added successfully"
}
```

## Governance API

### Get Governance Statistics

```http
GET /governance/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProposals": 25,
    "activeProposals": 3,
    "totalVotes": 8765,
    "participationRate": 68.5,
    "totalBudget": "1250000",
    "executedBudget": "850000",
    "successRate": 75.2,
    "averageVotingTime": 5.2
  }
}
```

### Get Voting Power

```http
GET /governance/voting-power/:address
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x1234...5678",
    "votingPower": "1250.5",
    "percentage": 0.125
  }
}
```

### Get Governance Parameters

```http
GET /governance/parameters
```

**Response:**
```json
{
  "success": true,
  "data": {
    "votingDelay": 1,
    "votingPeriod": 40320,
    "proposalThreshold": "1000",
    "quorum": "4000000"
  }
}
```

### Get Treasury Information

```http
GET /governance/treasury
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ethBalance": "10.5",
    "tokenBalance": "1000000",
    "totalSupply": "10000000"
  }
}
```

### Get Participation Metrics

```http
GET /governance/participation
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dailyActiveUsers": 45,
    "weeklyActiveUsers": 234,
    "monthlyActiveUsers": 1234,
    "averageVotesPerUser": 3.5,
    "votingTurnout": 68.5
  }
}
```

### Get Recent Activity

```http
GET /governance/activity?limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "proposal_created",
      "proposalId": "1",
      "proposer": "0x1234...5678",
      "title": "New Bike Lane Infrastructure",
      "timestamp": "2023-12-20T10:00:00Z"
    },
    {
      "type": "vote_cast",
      "proposalId": "1",
      "voter": "0x9876...5432",
      "support": "for",
      "timestamp": "2023-12-20T11:00:00Z"
    }
  ]
}
```

### Get Categories

```http
GET /governance/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    "Infrastructure",
    "Environment",
    "Education",
    "Healthcare",
    "Transportation",
    "Safety",
    "Culture",
    "Technology",
    "Other"
  ]
}
```

## Users API

### Get User Profile

```http
GET /users/profile/:address
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x1234...5678",
    "balance": "1250.5",
    "votingPower": "1250.5",
    "verified": true,
    "identityHash": "0xHash...",
    "joinedAt": 1703001600000,
    "totalVotes": 15,
    "proposalsCreated": 3,
    "reputation": 85
  }
}
```

### Update User Profile

```http
PUT /users/profile/:address
```

**Request Body:**
```json
{
  "preferences": {
    "notifications": true,
    "theme": "dark",
    "language": "en"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x1234...5678",
    "preferences": {
      "notifications": true,
      "theme": "dark",
      "language": "en"
    }
  },
  "message": "Profile updated successfully"
}
```

### Get User Voting History

```http
GET /users/:address/votes
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "proposalId": "1",
      "proposalTitle": "New Bike Lane Infrastructure",
      "support": "for",
      "weight": "100",
      "timestamp": "2023-12-20T10:00:00Z"
    }
  ]
}
```

### Get User Proposals

```http
GET /users/:address/proposals
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "New Bike Lane Infrastructure",
      "status": "active",
      "createdAt": "2023-12-20T10:00:00Z",
      "votesFor": 1250,
      "votesAgainst": 320
    }
  ]
}
```

### Verify ZK Identity

```http
POST /users/verify-identity
```

**Request Body:**
```json
{
  "identityHash": "0xHash...",
  "proof": "0xProof..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "identityHash": "0xHash..."
  },
  "message": "Identity verified successfully"
}
```

## IPFS API

### Upload File

```http
POST /ipfs/upload
```

**Request:** Multipart form data with file

**Response:**
```json
{
  "success": true,
  "data": {
    "hash": "QmHash...",
    "size": 1024,
    "url": "https://ipfs.io/ipfs/QmHash..."
  }
}
```

### Upload JSON

```http
POST /ipfs/upload-json
```

**Request Body:**
```json
{
  "data": {
    "title": "Proposal Title",
    "description": "Description..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hash": "QmHash...",
    "url": "https://ipfs.io/ipfs/QmHash..."
  }
}
```

### Get File

```http
GET /ipfs/:hash
```

**Response:** File content or JSON data

### Pin File

```http
POST /ipfs/pin/:hash
```

**Response:**
```json
{
  "success": true,
  "message": "File pinned successfully"
}
```

## Rate Limiting

API endpoints are rate limited:
- 100 requests per 15 minutes per IP
- 1000 requests per hour for authenticated users

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## WebSocket Events

Real-time updates are available via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:3001/ws');

// Listen for proposal updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'proposal_updated') {
    // Handle proposal update
  }
};
```

**Event Types:**
- `proposal_created`
- `proposal_updated`
- `vote_cast`
- `proposal_executed`
- `comment_added`
