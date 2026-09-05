<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>Read the history.</strong>
</p>

Returns entries newest first, filtered by resource, actor, action, outcome, or
time window, in pages.

## From the SDK

```ts
const page = await syner.activity.list({
  organization: 'acme',
  resource: {
    kind: 'app',
    id: appId,
  },
  since: '2026-03-01',
})
```

## From the CLI

```bash
syner activity list --app billing --since 2026-03-01
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api activity/list '{
  "organization": "acme",
  "resource": {
    "kind": "app",
    "id": "app_7c3a"
  },
  "since": "2026-03-01"
}'
```

## Response

```json
{
  "items": [
    {
      "id": "act_5c8v",
      "organizationId": "org_3f9k",
      "actor": {
        "principalId": "prn_bot",
        "delegationId": "del_2m4n",
        "onBehalfOf": "prn_ana"
      },
      "action": "apps/create",
      "resource": {
        "kind": "app",
        "id": "app_7c3a"
      },
      "outcome": "succeeded",
      "details": {
        "after": {
          "name": "billing"
        }
      },
      "at": "2026-09-04T18:24:30Z"
    }
  ],
  "next": null
}
```
