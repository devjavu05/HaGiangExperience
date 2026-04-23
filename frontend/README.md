# Frontend Structure

```
frontend/
├── package.json
├── src/
│   ├── App.js
│   ├── main.jsx
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── experience/
│   │   └── layout/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── utils/
└── public/
```

Suggested conventions:
- `components/common`: reusable UI pieces like buttons or section headers
- `components/layout`: header, footer, containers
- `components/experience`: domain-specific cards and sections
- `pages`: route-level screens
- `hooks`: reusable React hooks
- `services`: API calls
- `utils`: formatting and helpers
