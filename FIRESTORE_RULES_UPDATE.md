# Firestore Rules Update Required

After pushing, update your Firestore security rules to allow authenticated admins
to read/write the new `sitePages` collection.

Go to **Firebase Console → Firestore → Rules** and add:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Blog posts — public read, auth write
    match /blogPosts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Site pages (about, privacy, footer) — public read, auth write
    match /sitePages/{pageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

That's it! The `sitePages` collection is auto-created the first time you save
a page in the Admin → Site Pages tab.
