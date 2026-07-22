const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { auth: authV1 } = require('firebase-functions/v1');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { defineString } = require('firebase-functions/params');

initializeApp();

const adminEmailsParam = defineString('ADMIN_EMAILS', {
  description: 'Comma-separated admin email addresses (server-side only)',
  default: '',
});

function getAdminEmails() {
  return new Set(
    adminEmailsParam
      .value()
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

function shouldBeAdmin(email) {
  return Boolean(email && getAdminEmails().has(email.toLowerCase()));
}

async function syncClaimForUser(uid, email, emailVerified, existingClaims = {}) {
  const isAdmin = shouldBeAdmin(email) && emailVerified === true;
  const currentlyAdmin = existingClaims.admin === true;

  if (isAdmin === currentlyAdmin) {
    return isAdmin;
  }

  const claims = { ...existingClaims };
  if (isAdmin) {
    claims.admin = true;
  } else {
    delete claims.admin;
  }

  await getAuth().setCustomUserClaims(uid, claims);
  return isAdmin;
}

exports.syncAdminClaim = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  const user = await getAuth().getUser(request.auth.uid);
  const isAdmin = await syncClaimForUser(
    user.uid,
    user.email,
    user.emailVerified,
    user.customClaims || {}
  );

  const pendingVerification = shouldBeAdmin(user.email) && !user.emailVerified;

  return { admin: isAdmin, pendingVerification };
});

exports.onAuthUserCreate = authV1.user().onCreate(async (user) => {
  if (user.email) {
    await syncClaimForUser(user.uid, user.email, user.emailVerified, user.customClaims || {});
  }
});
