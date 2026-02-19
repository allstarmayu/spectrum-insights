export const DROPDOWN_TOPICS = {
  broadband: [
    { id: 'provider_comparison', label: 'Provider Comparison', keywords: ['Spectrum Internet', 'Xfinity', 'AT&T Fiber', 'T-Mobile Home Internet', 'Verizon 5G Home'] },
    { id: 'switching_intent', label: 'Switching Intent', keywords: ['Switch Internet Provider', 'Cancel Spectrum', 'Best Internet Provider', 'Internet Providers Near Me', 'Cheapest Internet'] },
    { id: 'speed_reliability', label: 'Speed & Reliability', keywords: ['Internet Speed Test', 'Internet Outage', 'Fastest Internet Provider', 'Fiber vs Cable', 'Best Home Internet'] },
    { id: 'pricing', label: 'Pricing', keywords: ['Cheap Internet', 'Internet Plans', 'Unlimited Internet', 'Internet Deals', 'Low Income Internet'] },
    { id: 'new_technology', label: 'New Technology', keywords: ['Starlink', '5G Home Internet', 'Fiber Internet', 'Fixed Wireless', 'Satellite Internet'] },
  ],
  cord_cutting: [
    { id: 'live_tv', label: 'Live TV Streaming', keywords: ['YouTube TV', 'Hulu Live TV', 'Sling TV', 'FuboTV', 'DirecTV Stream'] },
    { id: 'on_demand', label: 'On-Demand', keywords: ['Netflix', 'Disney Plus', 'Max', 'Amazon Prime Video', 'Apple TV Plus'] },
    { id: 'switching_intent', label: 'Switching Intent', keywords: ['Cancel Cable', 'Cancel Spectrum TV', 'Cut the Cord', 'Cable Alternative', 'Drop Cable'] },
    { id: 'sports', label: 'Sports Streaming', keywords: ['ESPN Plus', 'NFL Streaming', 'NBA League Pass', 'Sports Streaming', 'Watch NFL Without Cable'] },
    { id: 'devices', label: 'Devices', keywords: ['Roku', 'Fire TV Stick', 'Apple TV', 'Google Chromecast', 'Smart TV'] },
  ],
  mobile: [
    { id: 'carrier_comparison', label: 'Carrier Comparison', keywords: ['Spectrum Mobile', 'Verizon', 'AT&T', 'T-Mobile', 'Xfinity Mobile'] },
    { id: 'switching_intent', label: 'Switching Intent', keywords: ['Switch Phone Carrier', 'Cancel Verizon', 'Best Cell Phone Plan', 'Cheapest Phone Plan', 'BYOD'] },
    { id: 'coverage', label: 'Coverage', keywords: ['5G Coverage Map', 'Best Coverage Area', 'T-Mobile Coverage', 'Verizon Coverage', 'AT&T Coverage'] },
    { id: 'pricing', label: 'Pricing', keywords: ['Unlimited Data Plan', 'Family Phone Plan', 'Prepaid Phone Plan', 'Phone Plan Deals', 'Cheap Unlimited'] },
    { id: 'bundling', label: 'Bundling', keywords: ['Internet and Phone Bundle', 'Spectrum Bundle', 'Cable and Mobile Bundle', 'Home Internet Bundle', 'Wireless Bundle'] },
  ],
};

export const NAV_TOPICS = [
  { id: 'broadband', label: 'Broadband' },
  { id: 'cord_cutting', label: 'Cord Cutting' },
  { id: 'mobile', label: 'Mobile' },
];