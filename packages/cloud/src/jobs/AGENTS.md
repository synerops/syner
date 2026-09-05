# Jobs

Durable work definitions with triggers, events, and runs. A trigger is
what starts a run; start.ts and cancel.ts are the verbs. A run is one
occurrence of a defined job: it can invoke compute or an app, and it is
never an environment itself.
