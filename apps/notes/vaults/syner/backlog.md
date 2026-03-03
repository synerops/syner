# Backlog

Items pendientes para Syner.

## Pending

### Follow-up automático de issues asignados

Syner debería poder hacer follow-up de issues que asignó:
- Detectar issues sin actividad después de X días
- Notificar al asignado: "oye, el issue #20 lleva X días sin avance, ¿bloqueado en algo?"
- Ofrecer ayuda o re-priorizar

**Contexto**: Surgió al cerrar el loop de orquestación (notas → contexto → issue → asignación). El siguiente paso natural es que Syner también haga seguimiento.

**Requiere**:
- Skill que liste issues asignados por Syner
- Lógica de detección de stale (¿7 días sin commits/comments?)
- Canal de notificación (¿GitHub comment? ¿Slack?)
