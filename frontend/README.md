# frontend

expo/react-native frontend for notes app.

# easy way

```bash
./setup.sh
./run.sh
```

# more specific way

## setup

1. install dependencies
```bash
npm install
```

2. setup environment
```bash
cp .env.example .env
```

fill in `.env`:
- `EXPO_PUBLIC_SUPABASE_URL`: your supabase url
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: your supabase anon key
- `EXPO_PUBLIC_API_URL`: deployed gcp backend url
- `EXPO_PUBLIC_DEV_API_URL`: (optional) dev backend url (e.g. ngrok). defaults to `http://localhost:8000` if empty.
- `EXPO_PUBLIC__DEV__`: (optional) set to `true` to enable dev mode. defaults to `false` if empty.

## running

start development server:
```bash
npx expo start
```

## api url logic

the app automatically picks the url:
- **dev mode** (`npx expo start`): uses `EXPO_PUBLIC_DEV_API_URL` or fallback to `http://localhost:8000`.
- **prod mode** (builds): uses `EXPO_PUBLIC_API_URL`.
