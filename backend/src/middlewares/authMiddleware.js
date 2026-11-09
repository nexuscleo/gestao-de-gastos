import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "financas_super_secret_jwt_key_2026";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // Permite requisições sem token para manter compatibilidade com modo offline/convidado
    req.userId = null;
    return next();
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Token de autenticação malformado." });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Sessão expirada ou token inválido. Faça login novamente." });
  }
}
