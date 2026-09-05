<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">files</h1>

<p align="center">
  <strong>Blobs inside a store, addressed by path.</strong>
</p>

A file is bytes under a path, with a content type and a size. Put streams
bytes in; get hands back a way to read them; list walks paths by prefix. Files
are for what does not fit a JSON body: uploads, exports, artifacts.

## What a file looks like

- **Store.** where it lives.
- **Path.** unique inside the store.
- **Content type and size.** what it is and how big.
- **ETag.** changes on every put.
- **Updated by, at.** who and when.

## What you can do with it

| Verb | Who | What happens |
|---|---|---|
| [put](put/README.md) | anyone who can write the store | uploads or replaces the file |
| [get](get/README.md) | anyone who can read the store | returns metadata and a way to read the bytes |
| [list](list/README.md) | anyone who can read the store | returns paths by prefix |
| [remove](remove/README.md) | anyone who can write the store | deletes it |

## How it relates to the rest

Lives in a [store](../stores/README.md). Structured data goes to
[documents](../documents/README.md). Execution artifacts from
[compute](../../compute/executions/README.md) are files. Space is metered in
[usage](../../usage/README.md).
