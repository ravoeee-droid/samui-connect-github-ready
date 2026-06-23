import heroConnect from '@/assets/samui/hero-connect.webp';
import snorkeling from '@/assets/samui/snorkeling.webp';
import nightlife from '@/assets/samui/nightlife.webp';
import coworking from '@/assets/samui/coworking.webp';
import workConnect from '@/assets/samui/work-connect.webp';
import communityEvent from '@/assets/samui/community-event.webp';
import heroIsland from '@/assets/samui/hero-island.webp';
import connectRooms from '@/assets/samui/connect-rooms.webp';
import eventsMeetup from '@/assets/samui/events-meetup.webp';
import workCoworking from '@/assets/samui/work-coworking.webp';
import rentalsVehicles from '@/assets/samui/rentals-vehicles.webp';
import scooterListing from '@/assets/samui/scooter-listing.webp';
import staysOverview from '@/assets/samui/stays-overview.webp';
import villaLuxury from '@/assets/samui/villa-luxury.webp';
import familyStay from '@/assets/samui/family-stay.webp';

export const samuiVisuals = {
  hero: heroIsland || heroConnect,
  heroConnect,
  connect: connectRooms,
  activities: snorkeling,
  nightlife,
  coworking: workCoworking || coworking,
  b2b: workConnect,
  work: workConnect,
  workCoworking,
  social: communityEvent,
  events: eventsMeetup || communityEvent,
  rentals: rentalsVehicles,
  vehicles: rentalsVehicles,
  scooter: scooterListing,
  stays: staysOverview,
  villa: villaLuxury,
  familyStay,
};

export const visualByCategory = (category) => {
  if (!category) return samuiVisuals.hero;
  return samuiVisuals[category] || samuiVisuals.social;
};
