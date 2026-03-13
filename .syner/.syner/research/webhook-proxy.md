# Webhook Proxy para Desarrollo Local

Research sobre soluciones para desarrollar con webhooks localmente sin tener que cambiar endpoints en produccion cada vez.

**Fecha:** 2026-03-10

## El Problema

Cuando desarrollas un bot o integracion que recibe webhooks (Slack, GitHub, Stripe, etc.):

1. Los webhooks requieren una URL pública HTTPS
2. Tu servidor local (`localhost:3000`) no es accesible desde internet
3. Soluciones como ngrok generan URLs aleatorias cada vez
4. Tienes que ir a Slack/GitHub y actualizar el endpoint manualmente
5. No puedes probar cambios sin deployar a produccion

```
┌─────────┐         ┌─────────────┐
│  Slack  │────X───►│ localhost   │  No puede llegar
└─────────┘         └─────────────┘
```

## Opciones de Solución

### 1. Tunnel Services (ngrok y alternativas)

Exponen tu localhost a internet via un servidor intermediario.

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐
│  Slack  │────►│ ngrok.io    │────►│ localhost   │
└─────────┘     └─────────────┘     └─────────────┘
```

| Servicio | URL Persistente | Precio | Notas |
|----------|-----------------|--------|-------|
| **ngrok** | Solo en planes pagos | Free tier limitado | El mas conocido, buenas herramientas de debug |
| **Cloudflare Tunnel** | Si (con dominio propio) | Gratis | Requiere dominio en Cloudflare |
| **Pinggy** | No | ~$2.50/mes | Zero install, solo SSH |
| **LocalXpose** | Si en pagos | $8/mes | Soporta UDP |
| **Tailscale Funnel** | Si | Gratis personal | Mesh VPN, ideal para equipos |

#### ngrok

```bash
ngrok http 3000
# Genera: https://abc123.ngrok.io (cambia cada vez en free tier)
```

**Pros:** Request inspector, replay, buenas herramientas
**Cons:** Free tier muy limitado en 2026, URLs aleatorias

#### Cloudflare Tunnel

```bash
# Instalacion
brew install cloudflared
cloudflared tunnel login

# Crear tunnel persistente
cloudflared tunnel create local-dev
cloudflared tunnel route dns local-dev dev.tudominio.com

# Configurar ~/.cloudflared/config.yml
tunnel: <TUNNEL_ID>
credentials-file: ~/.cloudflared/<TUNNEL_ID>.json
ingress:
  - hostname: dev.tudominio.com
    service: http://localhost:3000
  - service: http_status:404

# Correr
cloudflared tunnel run local-dev
```

**Pros:**
- URLs permanentes (nunca cambian)
- Gratis ilimitado
- HTTPS automatico
- Puede correr como servicio de fondo

**Cons:**
- Requiere dominio manejado por Cloudflare
- Outages globales de Cloudflare afectan tu tunnel
- Setup inicial mas complejo

#### Pinggy (Zero Install)

```bash
ssh -p 443 -R0:localhost:3000 a.pinggy.io
# No requiere instalar nada, solo SSH
```

### 2. Socket Mode (Solo Slack)

Slack ofrece Socket Mode: en lugar de webhooks HTTP, usa WebSocket.

```
┌─────────┐                    ┌─────────────┐
│  Slack  │◄──── WebSocket ───►│ localhost   │
└─────────┘                    └─────────────┘
```

**Pros:**
- No requiere URL publica
- Funciona detras de firewalls corporativos
- Ideal para desarrollo local

**Cons:**
- Solo para Slack (GitHub, Stripe no lo soportan)
- Limite de 10 conexiones concurrentes
- No se puede publicar en Slack Marketplace
- Slack recomienda HTTP para produccion

```javascript
// Con Bolt
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true, // Habilitar Socket Mode
})
```

**Recomendacion de Slack:**
> "Using Socket Mode when developing your app and using it locally. Once deployed and published for use in a team setting, we recommend using HTTP request URLs."

### 3. Self-Hosted Tunnel (Cloudflare Worker + WebSocket)

Arquitectura de [webhooks-proxy-tunnel](https://github.com/peter-leonov/webhooks-proxy-tunnel):

```
┌───────────┐     ┌─────────────────┐                    ┌────────────────┐
│ Slack     │     │ Cloudflare      │                    │ localhost      │
│ GitHub    │────►│ Worker          │◄──── WebSocket ───►│                │
│ etc.      │     │ (tu cuenta)     │                    │ :3000          │
└───────────┘     └─────────────────┘                    └────────────────┘
```

**Como funciona:**
1. Deploy un Cloudflare Worker en tu cuenta (gratis)
2. El Worker recibe requests HTTP publicos
3. Tu maquina local conecta via WebSocket al Worker
4. El Worker reenvía requests por el WebSocket a tu local
5. Tu local responde y el Worker devuelve la response

**Setup:**
```bash
git clone https://github.com/peter-leonov/webhooks-proxy-tunnel.git
cd webhooks-proxy-tunnel
( cd worker && npm i && npm run deploy )
# Obtenes: https://webhooks-proxy-tunnel.TU_CUENTA.workers.dev
```

**Seguridad:**
- UUID v4 como tunnel ID (imposible adivinar)
- Token secreto opcional para autenticacion adicional
- Puedes renombrar el worker para obscurecer el endpoint

**Limitaciones:**
- No soporta streaming (request/response debe caber en memoria)
- ~100MB limite por request (limite de Workers)

**Pros:**
- Gratis (Cloudflare Free tier)
- Self-hosted (sin dependencia de terceros)
- Codigo auditable (~50 lineas el cliente)
- Multiples tunnels paralelos

### 4. Hybrid: Produccion fija + Dev dinamico

Mantener dos configuraciones:

```
PRODUCTION:
  Slack → https://syner.bot/api/webhooks/slack

DEVELOPMENT:
  Slack → https://dev.syner.bot/api/webhooks/slack
              ↓ (Cloudflare Tunnel)
          localhost:3001
```

**Beneficio:** Nunca tocas la config de produccion.

## Comparativa para el Caso Slack + GitHub

| Criterio | ngrok | Cloudflare Tunnel | Socket Mode | Self-Hosted |
|----------|-------|-------------------|-------------|-------------|
| Slack | Si | Si | Si (ideal para dev) | Si |
| GitHub | Si | Si | No | Si |
| URL Persistente | No (free) | Si | N/A | Si |
| Zero Config | Si | No | Si | No |
| Costo | $$ para persistente | Gratis | Gratis | Gratis |
| Control | Bajo | Medio | N/A | Total |

## Arquitectura Recomendada

### Para desarrollo rápido (ya)

**Socket Mode para Slack** + **ngrok para GitHub**

```typescript
// Slack: Socket Mode (no requiere tunnel)
const slack = new App({
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
})

// GitHub: ngrok (temporal)
// ngrok http 3001
```

### Para desarrollo serio (setup una vez)

**Cloudflare Tunnel con subdominio persistente**

```yaml
# ~/.cloudflared/config.yml
ingress:
  - hostname: dev.syner.bot
    service: http://localhost:3001
```

Configurar Slack y GitHub UNA VEZ con `https://dev.syner.bot/api/webhooks/*` y nunca volver a tocarlo.

### Para control total (self-hosted)

**Fork de webhooks-proxy-tunnel en tu cuenta de Cloudflare**

Deploy el worker en tu cuenta, conecta desde local, tienes tunnel persistente sin depender de nadie.

## Integracion con Vercel

Vercel no tiene tunnel nativo, pero:

1. **Preview Deployments**: Cada PR tiene su propia URL
2. **Para webhooks protegidos**: Agregar bypass token

```
https://your-app.vercel.app/api/slack?x-vercel-protection-bypass=SECRET
```

3. **El approach de Vercel Academy**: Script que:
   - Detecta puerto local
   - Levanta ngrok
   - Actualiza `manifest.json` automaticamente
   - Restaura al salir (no commitea URLs de tunnel)

## Links

### Herramientas
- [ngrok](https://ngrok.com/)
- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/)
- [Pinggy](https://pinggy.io/)
- [LocalXpose](https://localxpose.io/)
- [Tailscale Funnel](https://tailscale.com/kb/1223/tailscale-funnel/)
- [webhooks-proxy-tunnel](https://github.com/peter-leonov/webhooks-proxy-tunnel)

### Slack
- [Socket Mode Docs](https://docs.slack.dev/apis/events-api/using-socket-mode/)
- [HTTP vs Socket Mode](https://docs.slack.dev/apis/events-api/comparing-http-socket-mode/)

### Guides
- [Persistent Webhooks with Cloudflare Tunnel](https://tareq.co/2025/11/local-webhook-cloudflare-tunnel/)
- [Vercel Academy: Tunnel Orchestration](https://vercel.com/academy/slack-agents/tunnel-orchestration)
- [Top ngrok Alternatives 2026](https://pinggy.io/blog/best_ngrok_alternatives/)

## Decision Checklist

- [ ] Solo necesito Slack? → Socket Mode
- [ ] Necesito GitHub/Stripe/otros? → Tunnel
- [ ] Quiero zero setup? → ngrok o Pinggy
- [ ] Quiero URL persistente gratis? → Cloudflare Tunnel
- [ ] Quiero control total? → Self-hosted con Cloudflare Worker
- [ ] Tengo dominio en Cloudflare? → Cloudflare Tunnel es la mejor opcion
