import { title } from "process"

export const SelectTravelList = [
    {
        id: 1,
        title: 'Just me',
        desc: 'A sole travels in exploration',
        icon: '✈️',
        people: '1'
    },
    {
        id: 2,
        title: 'A Couple',
        desc: 'Two traveles in tandem',
        icon: '🥂',
        people: '2 People'
    },
    {
        id: 3,
        title: 'Family',
        desc: 'A group of fun loving adv',
        icon: '🏡',
        people: '3 to 5 People'
    },
    {
        id: 4,
        title: 'Friends',
        desc: 'A bunch of thrill-seekes',
        icon: '⛵',
        people: '5 to 10 People'
    }
]

export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: '💵',
    },
    {
        id: 2,
        title: 'Moderate',
        desc: 'Keep cost on the average side',
        icon: '💰',
    },
    {
        id: 3,
        title: 'Luxury',
        desc: 'Dont worry about cost',
        icon: '💸',
    }
]

export const SelectTravelStyleOptions = [
    {
        id: 1,
        title: 'Relaxed',
        desc: 'Take it easy, enjoy the sights',
        icon: '🌴',
    },
    {
        id: 2,
        title: 'Adventure',
        desc: 'Thrill-seeking and active',
        icon: '🏞️',
    },
    {
        id: 3,
        title: 'Cultural',
        desc: 'Museums, history, and art',
        icon: '🏛️',
    },
    {
        id: 4,
        title: 'Nature',
        desc: 'Outdoors and scenic',
        icon: '🌲',
    },
    {
        id: 5,
        title: 'Luxury',
        desc: 'High-end experiences',
        icon: '🛎️',
    },
    {
        id: 6,
        title: 'Local',
        desc: 'Live like a local',
        icon: '🍜',
    }
];

export const SelectActivitiesOptions = [
    { id: 1, title: 'Hiking', desc: 'Explore trails and mountains', icon: '🥾' },
    { id: 2, title: 'Beach', desc: 'Relax by the sea', icon: '🏖️' },
    { id: 3, title: 'Museums', desc: 'Visit museums and galleries', icon: '🖼️' },
    { id: 4, title: 'Nightlife', desc: 'Enjoy bars and clubs', icon: '🍸' },
    { id: 5, title: 'Shopping', desc: 'Go shopping in local stores', icon: '🛍️' },
    { id: 6, title: 'Food Tour', desc: 'Taste local cuisine', icon: '🍲' }
];

export const SelectDietaryOptions = [
    { id: 1, title: 'No Preference', desc: 'No dietary restrictions', icon: '🍽️' },
    { id: 2, title: 'Vegetarian', desc: 'No meat or fish', icon: '🥦' },
    { id: 3, title: 'Vegan', desc: 'No animal products', icon: '🌱' },
    { id: 4, title: 'Gluten-Free', desc: 'No gluten', icon: '🌾' },
    { id: 5, title: 'Halal', desc: 'Halal food only', icon: '🕌' },
    { id: 6, title: 'Other', desc: 'Other dietary needs', icon: '❓' }
];

export const SelectAccessibilityOptions = [
  { id: 1, title: 'Wheelchair Access', desc: 'Accessible for wheelchairs', icon: '🦽' },
  { id: 2, title: 'Step-Free', desc: 'No stairs or steps', icon: '🚪' },
  { id: 3, title: 'Hearing Assistance', desc: 'Support for hearing impaired', icon: '🦻' },
  { id: 4, title: 'Visual Assistance', desc: 'Support for visually impaired', icon: '🦯' },
  { id: 5, title: 'Service Animals', desc: 'Service animals welcome', icon: '🐕‍🦺' },
  { id: 6, title: 'Other', desc: 'Other accessibility needs', icon: '❓' }
];

export const AI_PROMPT = 'Generate Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget}, give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time Travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format';