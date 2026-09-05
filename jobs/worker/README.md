<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">worker</h1>

<p align="center">
  <strong>Syner's receiver for durable work.</strong>
</p>

Receives the cloud's own webhooks: administration operations such as
deploying, rolling back, removing, and provisioning, and the runs of your
jobs when their triggers fire. Administrative work is followed as an
operation; your job's run is followed through its attempts and events. The
worker is a job on Syner in the same sense as yours: a target that receives
signed, idempotent deliveries, retried until they land.

<!-- prettier-ignore -->
> [!NOTE]
> This job is a scaffold. The delivery provider isn't decided yet.
