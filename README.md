# ShareSpace
Sharing unused Dropbox space for family and friends.

## Motivations
I use Dropbox as my primary Cloud storage prvoider to store files and
documents for easy access across multiple machines. Unfortunately, 
I only use a mere fraction of the space given to me with the Plus package.

I wanted a way to share access to my Dropbox space with friends and family. 
Dropbox, to my knowledge, offers two key features for non-business users to 
accomplish something similar to what I wanted: Share Folders or Link with Password.

Share Folders are convenient as it allows two or more parties to collaborate;
however, Share Folders consumes all parties space. That is, if a folder
is `500 MB` and there are `3` parties, each of the members must have `500 MB`
of free space available with their Dropbox subscription. In this case,
I wanted a way to share my Dropbox service to friends and family without
having them to create an account or consume space on their Dropbox.

Link with Password is an alternative as it allows people without Dropbox
accounts to access to files I have uploaded. The password does provide
some gating on who can and cannot see the files, it does not allow
someone with the link to upload a file. Furthermore, the password is 
owner driven rather than user driven. Perhaps there is some way combining this
approach with File Request to upload.

## Description
ShareSpace is a service that allows other trusted individuals to use
your Dropbox space. A user can register for an account with registration gated
by an `invite` code. A user can upload, rename, delete, or download files.

## Features
- [x] User sign in
- [x] User registration
- [x] User session (JWT)
- [x] Upload files
- [ ] Upload folders
- [x] Delete files
- [ ] Delete folders
- [x] Rename files
- [x] Rename folders
- [x] Download files
- [ ] Download folders (?)
- [x] Invite code gating
- [x] Connect to a User database

## Environment Variables
```
DROPBOX_ACCESS_TOKEN=
NODE_ENV=
JWT_SECRET=SECRET_TO_SIGN_JWT
COOKIE_SIGNATURE=SECRET_TO_SIGN_COOKIES
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
SALT_ROUNDS=ROUNDS_TO_SALT_PASSWORD_BEFORE_DATABASE_INSERTION
INVITE_CODE=REGISTRATION_GATE_INVITE_CODE

REACT_APP_API_ENDPOINT=HOST_OF_API (must end with "/api")
REACT_APP_BRAND=BRANDING_IN_NAVBAR
```