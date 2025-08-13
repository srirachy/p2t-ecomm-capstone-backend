import { auth } from 'express-oauth2-jwt-bearer'

export const validateAuth0ApiKey = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header'});
  }

  const token = authHeader.split(' ')[1];
  if(token !== process.env.AUTH0_API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
}

export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_BASE_URL,
  tokenSigningAlg: 'RS256'
});

export const isAdmin = (req, res, next) => {
  const perms = req.auth.payload.permissions || [];

  if(!perms.includes('manage:products')) {
    return res.status(403).json({error: 'admin access required'});
  }
  next();
}
