// Verified social profiles.
//
// Only add a URL here after loading it and confirming the page is ours. The
// previous hardcoded instagram.com/werepairmac in LocalBusinessSchema was a
// different business entirely ("Reparamos Laptop MultiMarcas"), which told
// Google an unrelated account was us. A vanity handle matching our name is not
// evidence of ownership.
//
// Facebook resolves to the page titled "We Repair Mac Call Out" — the same name
// as the Google Business Profile, which is how it was verified.
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=100088248782070';

// Trustpilot resolves to a profile claimed by us in April 2026, listing
// werepairmac.co.uk as its website — that pairing is how it was verified.
// Worth listing even at zero reviews: sameAs is how Google ties the profile to
// this business, and a namesake "We Repair Mac" trades from Mitcham on the .com,
// so leaving our own profiles unclaimed in the schema invites the wrong match.
export const TRUSTPILOT_URL = 'https://uk.trustpilot.com/review/werepairmac.co.uk';

/** Every verified profile, for the LocalBusiness `sameAs` array. */
export const SOCIAL_PROFILE_URLS = [FACEBOOK_URL, TRUSTPILOT_URL];
